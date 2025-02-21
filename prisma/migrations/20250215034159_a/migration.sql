/*
  Warnings:

  - You are about to drop the `Quoc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TinQuoc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TinQuoc" DROP CONSTRAINT "_TinQuoc_A_fkey";

-- DropForeignKey
ALTER TABLE "_TinQuoc" DROP CONSTRAINT "_TinQuoc_B_fkey";

-- DropTable
DROP TABLE "Quoc";

-- DropTable
DROP TABLE "Tin";

-- DropTable
DROP TABLE "_TinQuoc";
