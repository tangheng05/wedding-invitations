-- AlterTable
ALTER TABLE "public"."wedding_settings" ADD COLUMN     "backgroundMusicUrl" TEXT,
ADD COLUMN     "musicAutoPlay" BOOLEAN NOT NULL DEFAULT false;
