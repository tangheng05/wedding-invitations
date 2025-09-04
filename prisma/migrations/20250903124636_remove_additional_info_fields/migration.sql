/*
  Warnings:

  - You are about to drop the column `accommodationInfo` on the `wedding_settings` table. All the data in the column will be lost.
  - You are about to drop the column `giftInfo` on the `wedding_settings` table. All the data in the column will be lost.
  - You are about to drop the column `transportationInfo` on the `wedding_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."wedding_settings" DROP COLUMN "accommodationInfo",
DROP COLUMN "giftInfo",
DROP COLUMN "transportationInfo";
