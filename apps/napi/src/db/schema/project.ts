import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, serial, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { user } from './user';
import { org } from './org';

export const projectStatus = pgEnum("project_status", ["inactive", "active"])

export const project = pgTable("project", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    status: projectStatus("status").notNull().default("inactive"),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    userId: serial('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const createProjectSchema = createInsertSchema(project)

export const projectRelations = relations(project, ({ one, many }) => ({
    user: one(user, {
        fields: [project.userId],
        references: [user.id],
    }),
}));
