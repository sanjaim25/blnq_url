-- AlterTable: Make password optional for Google-authenticated users
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AddColumn: Store Google subject ID for account linking
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

-- AddColumn: Track authentication provider (email/google)
ALTER TABLE "User" ADD COLUMN "authProvider" TEXT DEFAULT 'email';

-- CreateIndex: Ensure googleId is unique across users
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
