-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "cuisineType" TEXT,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preparationTime" TEXT,
ADD COLUMN     "servingSize" TEXT,
ADD COLUMN     "spiceLevel" TEXT;
