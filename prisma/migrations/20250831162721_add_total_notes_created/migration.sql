/*
  Warnings:

  - You are about to drop the column `codeforcesUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leetcodeUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `redditUsername` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeforcesUsername",
DROP COLUMN "emailIds",
DROP COLUMN "githubUsername",
DROP COLUMN "leetcodeUsername",
DROP COLUMN "redditUsername",
ADD COLUMN     "totalNotesCreated" INTEGER NOT NULL DEFAULT 0;
