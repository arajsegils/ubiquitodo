ALTER TABLE "todo_lists" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_lists" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_lists" ADD COLUMN "updated_at" date;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "deadline" date;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "updated_at" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" date;