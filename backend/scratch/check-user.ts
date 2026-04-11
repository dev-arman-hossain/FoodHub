import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function check() {
    const user = await prisma.user.findUnique({
        where: { email: 'provider@foodhub.com' },
        select: { id: true, email: true, role: true, status: true }
    });
    console.log('Provider User:', user);
    
    const count = await prisma.user.count();
    console.log('Total Users:', count);
    
    await prisma.$disconnect();
}

check();
