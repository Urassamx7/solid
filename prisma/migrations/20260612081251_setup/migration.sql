-- AlterTable
ALTER TABLE "check_ins" ALTER COLUMN "created_at" SET DEFAULT timezone('Africa/Maputo', now());

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT timezone('Africa/Maputo', now()),
ALTER COLUMN "updated_at" SET DEFAULT timezone('Africa/Maputo', now());
