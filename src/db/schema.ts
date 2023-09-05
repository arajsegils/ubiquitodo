import { relations, sql } from "drizzle-orm";
import {
  boolean,
  timestamp,
  integer,
  pgTable,
  serial,
  text,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const todoLists = pgTable("todo_lists", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const todos = pgTable("todos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  done: boolean("done").default(false).notNull(),
  todoListId: uuid("todo_list_id")
    .references(() => todoLists.id)
    .notNull(),
  deadline: timestamp("deadline"),
  price: integer("price"),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

export const todoRelations = relations(todos, ({ many, one }) => ({
  subtasks: many(todos),
  todoList: one(todoLists, {
    fields: [todos.todoListId],
    references: [todoLists.id],
  }),
}));

export const todoListRelations = relations(todoLists, ({ many, one }) => ({
  todos: many(todos),
  owner: one(users, {
    fields: [todoLists.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  todoLists: many(todoLists),
}));
