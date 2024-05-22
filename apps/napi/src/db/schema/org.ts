import { relations, sql } from 'drizzle-orm';
import { pgTable, primaryKey, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';
import { createInsertSchema } from 'drizzle-zod'

export const org = pgTable("org", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    createdBy: uuid('createdBy').notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const userOrganizations = pgTable('userOrganizations', {
    userId: uuid('user_id').references(() => user.id),
    organizationId: uuid("org_id").references(() => org.id),
}, (table) => ({
    primaryKey: primaryKey({
        columns: [table.userId, table.organizationId]
    })
}));

export const orgRelations = relations(org, ({ one, many }) => ({
    createdBy: one(user, {
        fields: [org.createdBy],
        references: [user.id],
    }),
}))
export const orgInsertSchema = createInsertSchema(org)