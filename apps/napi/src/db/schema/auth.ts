import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user';

export const verifyEmailToken = pgTable('verify_email_token', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    token: uuid("token").defaultRandom(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    expiresAt: timestamp('expires_at').notNull().default(sql`now() + interval '1 day'`),
});



export const resetPasswordToken = pgTable('reset_password_token', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    token: uuid("token").defaultRandom(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    expiresAt: timestamp('expires_at').notNull().default(sql`now() + interval '1 day'`),
});


export const resetPasswordTokensRelations = relations(resetPasswordToken, ({ one }) => ({
    user: one(user, {
        fields: [resetPasswordToken.userId],
        references: [user.id],
    }),
}));

export const verifyEmailTokensRelations = relations(verifyEmailToken, ({ one }) => ({
    user: one(user, {
        fields: [verifyEmailToken.userId],
        references: [user.id],
    }),
}));