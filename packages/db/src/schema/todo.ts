import { boolean, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps } from '../utils';
import { user } from './auth';

export enum TodoStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export const todoStatusSchema = pgEnum('status', [
  TodoStatus.NOT_STARTED,
  TodoStatus.IN_PROGRESS,
  TodoStatus.COMPLETED,
]);

export const todos = pgTable('todos', {
  id: uuid().defaultRandom().primaryKey(),
  text: text('text').notNull(),
  description: text('description'),
  active: boolean('active').default(true).notNull(),
  status: todoStatusSchema('status').default(TodoStatus.NOT_STARTED).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const todoInsert = createInsertSchema(todos, {
  status: z.enum(TodoStatus),
});

export const apiTodoCreate = todoInsert.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const todoUpdate = createUpdateSchema(todos, {
  status: z.enum(TodoStatus),
});

export const apiTodoUpdate = todoUpdate.omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const apiTodoCreateAndUpdate = apiTodoCreate.extend({
  id: z.uuid().optional(),
  text: z.string().min(3).max(250),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const apiTodoId = apiTodoCreateAndUpdate.pick({
  id: true,
});

export type Todo = typeof todos.$inferSelect;
export type TodoCreate = z.infer<typeof apiTodoCreate>;
export type TodoUpdate = z.infer<typeof apiTodoUpdate>;
export type TodoCreateAndUpdate = z.infer<typeof apiTodoCreateAndUpdate>;
export type TodoId = z.infer<typeof apiTodoId>;
