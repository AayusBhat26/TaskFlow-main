-- CreateEnum
CREATE TYPE "CompletionSoundEffect" AS ENUM ('SUCCESS', 'ACHIEVEMENT', 'TASK_COMPLETE', 'QUESTION_COMPLETE', 'BELL', 'DIGITAL', 'BIRD', 'FANCY', 'ANALOG', 'CHURCH_BELL');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskCompletionSound" "CompletionSoundEffect" NOT NULL DEFAULT 'TASK_COMPLETE',
    "questionCompletionSound" "CompletionSoundEffect" NOT NULL DEFAULT 'QUESTION_COMPLETE',
    "soundVolume" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "soundsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
