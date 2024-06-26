import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, primaryKey,timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';
import { createInsertSchema } from 'drizzle-zod'
import { project } from './project';

export const org = pgTable("org", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    createdBy: uuid('createdBy').notNull().references(() => user.id, { onDelete: "cascade" }),
})


export const memberRole = pgEnum("member_role", ["admin", "dev"])

export const orgMembers = pgTable("org_members", {
    orgId: uuid("org_id").notNull().references(() => org.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    role: memberRole("role").notNull(),
}, (_self) => ({
    pk: primaryKey({ columns: [_self.orgId, _self.userId] }),
}))

export const orgMembersRelations = relations(orgMembers, ({ one, many }) => ({
    org: one(org, {
        fields: [orgMembers.orgId],
        references: [org.id],
    }),
    user: one(user, {
        fields: [orgMembers.userId],
        references: [user.id],
    }),
}))

export const orgRelations = relations(org, ({ one, many }) => ({
    createdBy: one(user, {
        fields: [org.createdBy],
        references: [user.id],
    }),
    projects: many(project),
}))

export const orgInsertSchema = createInsertSchema(org)