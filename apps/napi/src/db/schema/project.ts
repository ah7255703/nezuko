import { sql } from 'drizzle-orm';
import { pgEnum, pgTable, varchar, timestamp, uuid, jsonb, text, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { user } from './user';
import { org } from './org';
import { z } from 'zod';

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
    request: jsonb("request").default(sql`'{}'::jsonb`).$type<{
        method: string;
        url: string;
        body: Record<string, any>;
        headers: Record<string, string>;
    }>().notNull(),
    apiCallsCount: bigint("api_calls_count", {
        mode: 'number'
    }).notNull().default(0),
    schemaVersion: varchar("schema_version", { length: 10 }).notNull().default("1.0"),
    schema: jsonb("schema").default(sql`'{}'::jsonb`).$type<Record<string, any>>().notNull(),
})
export const projectResponseEnv = pgEnum("project_response_env", ["test", "prod"])

export const projectResponse = pgTable("project_response", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    response: text("response").notNull(),
    responseShape: text("response_shape"),
    responseTsInterface: text("response_ts_interface"),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    env: projectResponseEnv("env").notNull(),
})

export const projectResponseRelations = relations(projectResponse, ({ one }) => ({
    project: one(project, {
        fields: [projectResponse.projectId],
        references: [project.id],
    }),
}));

export const createProjectSchema = createInsertSchema(project);
export const updateProjectSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(projectStatus.enumValues).optional(),
    request: z.object({
        method: z.string().optional(),
        url: z.string().optional(),
        body: z.record(z.any()).optional(),
        headers: z.record(z.string()).optional(),
    }).optional(),
    schema: z.record(z.any()).optional(),
})

export const projectRelations = relations(project, ({ one, many }) => ({
    user: one(user, {
        fields: [project.createdBy],
        references: [user.id],
    }),
    org: one(org, {
        fields: [project.org],
        references: [org.id],
    }),
    responses: many(projectResponse),
}));
