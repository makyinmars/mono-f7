import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from './auth';

export const todoStatus = pgEnum('todo_status', [
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
]);

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  description: text('description'),
  active: boolean('active').default(true).notNull(),
  status: todoStatus('status').default('NOT_STARTED').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const todoInsertSchema = createInsertSchema(todos);
export const todoSelectSchema = createSelectSchema(todos);

export const todoCreateSchema = z.object({
  text: z
    .string()
    .min(3, 'Todo text must be at least 3 characters')
    .max(250, 'Todo text must be less than 250 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const todoUpdateSchema = z.object({
  text: z
    .string()
    .min(3, 'Todo text must be at least 3 characters')
    .max(250, 'Todo text must be less than 250 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  active: z.boolean().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const apiTodoCreateSchema = z.object({
  text: z.string().min(3).max(250),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const apiTodoUpdateSchema = z.object({
  text: z.string().min(3).max(250).optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export type Todo = z.infer<typeof todoSelectSchema>;
export type TodoInsert = z.infer<typeof todoInsertSchema>;
export type TodoCreate = z.infer<typeof todoCreateSchema>;
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;
export type ApiTodoCreate = z.infer<typeof apiTodoCreateSchema>;
export type ApiTodoUpdate = z.infer<typeof apiTodoUpdateSchema>;
