import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { envVars } from '../config/env';

const categories = [
    { name: 'Italian', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' },
    { name: 'Japanese', imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10' },
    { name: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add' },
    { name: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e' },
];

export const seedDatabase = async () => {
    console.log('--- Starting Seeding Process ---');

    // 1. Seed Categories
    console.log('Seeding categories...');
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }

    // 2. Seed Admin
    const adminEmail = envVars.ADMIN_EMAIL;
    const adminPassword = envVars.ADMIN_PASSWORD;
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                name: 'FoodHub Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE',
            },
        });
        console.log(`Admin seeded: ${adminEmail}`);
    }

    // 3. Seed Provider
    const providerEmail = 'provider@foodhub.com';
    const existingProvider = await prisma.user.findUnique({ where: { email: providerEmail } });

    let providerId = '';
    let providerProfileId = '';

    if (!existingProvider) {
        const hashedPassword = await bcrypt.hash('Provider@123', 12);
        const provider = await prisma.user.create({
            data: {
                name: 'Mario Rossi',
                email: providerEmail,
                password: hashedPassword,
                role: 'PROVIDER',
                status: 'ACTIVE',
                providerProfile: {
                    create: {
                        businessName: "Mario's Italian Gourmet",
                        description: 'Authentic Italian cuisine crafted with passion and traditional recipes.',
                        address: '742 Evergreen Terrace, Springfield',
                        logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
                    }
                }
            },
            include: { providerProfile: true }
        });
        providerId = provider.id;
        providerProfileId = provider.providerProfile?.id || '';
        console.log(`Provider seeded: ${providerEmail}`);
    } else {
        const profile = await prisma.providerProfile.findUnique({ where: { userId: existingProvider.id } });
        providerProfileId = profile?.id || '';
    }

    // 4. Seed Meals
    if (providerProfileId) {
        console.log('Seeding meals...');
        const italianCat = await prisma.category.findUnique({ where: { name: 'Italian' } });
        const burgerCat = await prisma.category.findUnique({ where: { name: 'Burgers' } });
        const dessertCat = await prisma.category.findUnique({ where: { name: 'Desserts' } });

        const mealsToSeed = [
            {
                name: 'Truffle Tagliatelle',
                description: 'Handmade pasta with black truffle cream and aged parmesan.',
                price: 24.99,
                categoryId: italianCat?.id || '',
                providerId: providerProfileId,
                imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856',
            },
            {
                name: 'Wagyu Signature Burger',
                description: 'Caramelized onions, truffle aioli, and smoked provolone on a brioche bun.',
                price: 18.50,
                categoryId: burgerCat?.id || '',
                providerId: providerProfileId,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
            },
            {
                name: 'Gold Leaf Tiramisu',
                description: 'Classic espresso-soaked ladyfingers with a touch of edible gold leaf.',
                price: 12.00,
                categoryId: dessertCat?.id || '',
                providerId: providerProfileId,
                imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
            },
            {
                name: 'Wild Mushroom Risotto',
                description: 'Creamy Arborio rice with porcini and oyster mushrooms.',
                price: 21.00,
                categoryId: italianCat?.id || '',
                providerId: providerProfileId,
                imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
            }
        ];

        for (const meal of mealsToSeed) {
            await prisma.meal.create({
                data: meal
            });
        }
    }

    console.log('--- Seeding Completed Successfully ---');
};
