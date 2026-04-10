import { prisma } from '../src/lib/prisma';

async function syncRatings() {
  console.log('Syncing meal ratings...');
  const meals = await prisma.meal.findMany({
    include: { reviews: true }
  });

  for (const meal of meals) {
    const reviewCount = meal.reviews.length;
    const avgRating = reviewCount 
      ? meal.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
      : 0;

    await prisma.meal.update({
      where: { id: meal.id },
      data: {
        avgRating,
        reviewCount
      }
    });
    console.log(`Updated meal: ${meal.name} - Rating: ${avgRating.toFixed(1)} (${reviewCount} reviews)`);
  }

  console.log('Sync complete!');
  await prisma.$disconnect();
}

syncRatings().catch(err => {
  console.error(err);
  process.exit(1);
});
