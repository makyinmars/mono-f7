CREATE TYPE "public"."status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::text::"public"."status";--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';--> statement-breakpoint
DROP TYPE "public"."todo_status";