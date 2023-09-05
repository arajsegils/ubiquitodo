/**
 * DEPRECATED
 */

import { eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "./trpc";

import * as schema from "@/db/schema";
import { todoLists, todos, users } from "@/db/schema";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
const db = drizzle(sql, { schema });

// migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getTodoList: publicProcedure.input(z.string()).query(async (opts) => {
    const todoList = await db.query.todoLists.findFirst({
      where: eq(todoLists.id, opts.input),
      with: {
        todos: {
          orderBy: (todos, { asc }) => [asc(todos.order)],
        },
      },
    });
    if (!todoList) {
      const newList = (
        await db
          .insert(todoLists)
          .values({ id: opts.input, name: "New List", userId: 1 })
          .returning()
      )[0];
      return { ...newList, todos: [] };
    }
    return todoList;
  }),

  getOrCreateTodoList: publicProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const todoList = await db
        .select()
        .from(todoLists)
        .where(eq(todoLists.id, opts.input))
        .execute();
      if (todoList.length > 0) {
        return todoList[0];
      }
      await db
        .insert(todoLists)
        .values({ id: opts.input, name: "New List", userId: 1 })
        .execute();
      return await db
        .select()
        .from(todoLists)
        .where(eq(todoLists.id, opts.input))
        .execute();
    }),

  getTodos: publicProcedure.query(async () => {
    return await db.select().from(todos);
  }),
  getTodo: publicProcedure.input(z.string()).query(async (opts) => {
    return await db.query.todos.findFirst({
      where: eq(todos.id, opts.input),
    });
  }),
  addTodo: publicProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        todoListId: z.string(),
      })
    )
    .mutation(async (opts) => {
      console.log({ opts: opts.input });
      const todoWithMaxOrder = await db.query.todos
        .findFirst({
          columns: {
            order: true,
          },
          where: eq(todos.todoListId, opts.input.todoListId),
          orderBy: (todos, { desc }) => [desc(todos.order)],
        })
        .execute();
      const todo = await db
        .insert(todos)
        .values({
          title: opts.input.title,
          subtitle: opts.input.subtitle,
          todoListId: opts.input.todoListId,
          order: todoWithMaxOrder ? todoWithMaxOrder.order + 1 : 0,
        })
        .returning();
      return true;
    }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      await db
        .update(todos)
        .set({ done: opts.input.done })
        .where(eq(todos.id, opts.input.id))
        .execute();
      return true;
    }),

  getUser: publicProcedure
    .input(z.number().positive().int().nullable())
    .query(async (opts) => {
      if (!opts.input) {
        return;
      }
      return await db
        .select()
        .from(users)
        .where(eq(users.id, opts.input))
        .execute();
    }),

  addUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      return await db.insert(users).values(opts.input).execute();
    }),

  syncUser: publicProcedure
    .input(z.object({ name: z.string(), id: z.number().positive().int() }))
    .mutation(async (opts) => {
      return await db
        .update(users)
        .set({ name: opts.input.name })
        .where(eq(users.id, opts.input.id))
        .execute();
    }),
});

export type AppRouter = typeof appRouter;
