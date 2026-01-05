-- CreateEnum
CREATE TYPE "LlmMessageType" AS ENUM ('USER', 'AI', 'SYSTEM');

-- CreateTable
CREATE TABLE "LlmSession" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LlmMessage" (
    "id" TEXT NOT NULL,
    "type" "LlmMessageType" NOT NULL,
    "content" TEXT,
    "llmSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LlmMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LlmSession_userId_idx" ON "LlmSession"("userId");

-- CreateIndex
CREATE INDEX "LlmMessage_createdAt_idx" ON "LlmMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "LlmSession" ADD CONSTRAINT "LlmSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LlmMessage" ADD CONSTRAINT "LlmMessage_llmSessionId_fkey" FOREIGN KEY ("llmSessionId") REFERENCES "LlmSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
