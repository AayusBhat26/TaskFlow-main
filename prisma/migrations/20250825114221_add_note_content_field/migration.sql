/*
  Warnings:

  - The values [PERSONAL_USE] on the enum `UseCase` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UseCase_new" AS ENUM ('WORK', 'STUDY');
ALTER TABLE "User" ALTER COLUMN "useCase" TYPE "UseCase_new" USING ("useCase"::text::"UseCase_new");
ALTER TYPE "UseCase" RENAME TO "UseCase_old";
ALTER TYPE "UseCase_new" RENAME TO "UseCase";
DROP TYPE "UseCase_old";
COMMIT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "content" TEXT;
