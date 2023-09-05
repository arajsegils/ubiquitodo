ALTER TABLE "todos" ALTER COLUMN "todo_list_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "order" integer NOT NULL;