import { db } from './index.ts';
import { users, entries } from './schema.ts';
import { eq, and } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database operation failed.', { cause: error });
  }
}

export async function getUserEntries(userDbId: number) {
  try {
    return await db.select().from(entries).where(eq(entries.userId, userDbId));
  } catch (error) {
    console.error('Database getUserEntries failed:', error);
    throw new Error('Failed to retrieve entries.', { cause: error });
  }
}

export async function createEntry(userDbId: number, content: string, date: string) {
  try {
    const result = await db
      .insert(entries)
      .values({
        userId: userDbId,
        content,
        date,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database createEntry failed:', error);
    throw new Error('Failed to create entry.', { cause: error });
  }
}

export async function deleteEntry(entryId: number, userDbId: number) {
  try {
    return await db
      .delete(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, userDbId)))
      .returning();
  } catch (error) {
    console.error('Database deleteEntry failed:', error);
    throw new Error('Failed to delete entry.', { cause: error });
  }
}
