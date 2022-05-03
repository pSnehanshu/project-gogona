-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_minTierId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "minTierId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_minTierId_fkey" FOREIGN KEY ("minTierId") REFERENCES "MembershipTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
