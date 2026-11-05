import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'entries' table for storing user notes, workspace artifacts, or chats
export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(), // Format: YYYY-MM-DD
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table.
export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

// Define relationships for the 'entries' table.
export const entriesRelations = relations(entries, ({ one }) => ({
  author: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));
