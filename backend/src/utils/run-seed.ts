import { seedDatabase } from './seed';
import { prisma } from '../lib/prisma';

seedDatabase()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
