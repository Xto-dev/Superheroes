/*
  Warnings:

  - You are about to drop the column `images` on the `superheroes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "superheroes" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "SuperheroImage" (
    "id" TEXT NOT NULL,
    "superheroId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SuperheroImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SuperheroImage_superheroId_idx" ON "SuperheroImage"("superheroId");

-- CreateIndex
CREATE INDEX "SuperheroImage_imageId_idx" ON "SuperheroImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "SuperheroImage_superheroId_imageId_key" ON "SuperheroImage"("superheroId", "imageId");

-- AddForeignKey
ALTER TABLE "SuperheroImage" ADD CONSTRAINT "SuperheroImage_superheroId_fkey" FOREIGN KEY ("superheroId") REFERENCES "superheroes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuperheroImage" ADD CONSTRAINT "SuperheroImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
