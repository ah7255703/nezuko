import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { uuid } from 'drizzle-orm/pg-core';

export const userRole = pgEnum("user_role", [
    "admin",
    "user",
]);

export const theme = pgEnum("theme", [
    "light",
    "dark",
    "system"
]);

export const creationMethod = pgEnum("creation_method", [
    "email-password",
    "social",
    "email-only",
]);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    role: userRole('role').notNull().default("user"),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    password: varchar('password', { length: 256 }),
    creationMethod: creationMethod('creation_method').notNull().default("email-password"),
    verifiedEmailAt: timestamp('verified_email_at'),
    verifiedEmail: boolean('verified_email').notNull().default(false)
});

export const profile = pgTable('profile', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    image: varchar('image_url', { length: 256 }),
    theme: theme('theme').notNull().default("system"),
    userId: serial('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const resetPasswordToken = pgTable('reset_password_token', {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: uuid("token").defaultRandom(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    expiresAt: timestamp('expires_at').notNull().default(sql`now() + interval '1 day'`),
});

export const verifyEmailToken = pgTable('verify_email_token', {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: uuid("token").defaultRandom(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
    expiresAt: timestamp('expires_at').notNull().default(sql`now() + interval '1 day'`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    profile: one(profile, {
        fields: [users.id],
        references: [profile.userId],
    }),
    resetPasswordTokens: many(resetPasswordToken),
    verifyEmailTokens: many(verifyEmailToken),
}));

export const resetPasswordTokensRelations = relations(resetPasswordToken, ({ one, many }) => ({
    user: one(users, {
        fields: [resetPasswordToken.userId],
        references: [users.id],
    }),
}));

export const verifyEmailTokensRelations = relations(verifyEmailToken, ({ one, many }) => ({
    user: one(users, {
        fields: [verifyEmailToken.userId],
        references: [users.id],
    }),
}));

const createUserSchema = createInsertSchema(users);
const updateUserSchema = createInsertSchema(users);
export { createUserSchema, updateUserSchema };

