import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { user } from './user';
import { org } from './org';

export const projectStatus = pgEnum("project_status", ["inactive", "active"])

export const project = pgTable("project", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    status: projectStatus("status").notNull().default("inactive"),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    createdBy: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    org: uuid('org_id').notNull().references(() => org.id, { onDelete: 'cascade' }),
})

export const createProjectSchema = createInsertSchema(project)

export const projectRelations = relations(project, ({ one, many }) => ({
    user: one(user, {
        fields: [project.createdBy],
        references: [user.id],
    }),
    org: one(org, {
        fields: [project.org],
        references: [org.id],
    }),
}));
