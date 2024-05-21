import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { resetPasswordToken, verifyEmailToken } from './auth';
import { org } from './org';
import { project } from './project';

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

export const user = pgTable('users', {
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
    userId: serial('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});


export const usersRelations = relations(user, ({ one, many }) => ({
    profile: one(profile, {
        fields: [user.id],
        references: [profile.userId],
    }),
    resetPasswordTokens: many(resetPasswordToken),
    verifyEmailTokens: many(verifyEmailToken),
    createdOrgs: many(org),
    projects: many(project)
}));



const createUserSchema = createInsertSchema(user);
const updateUserSchema = createInsertSchema(user);
export { createUserSchema, updateUserSchema };

