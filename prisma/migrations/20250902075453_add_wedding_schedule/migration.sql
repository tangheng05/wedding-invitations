/*
  Warnings:

  - Added the required column `scheduleEvents` to the `wedding_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."wedding_settings" ADD COLUMN     "scheduleEvents" JSONB NOT NULL DEFAULT '[]';
