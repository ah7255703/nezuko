import { sql } from 'drizzle-orm';
import { pgTable, primaryKey, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './user';
import { createInsertSchema } from 'drizzle-zod'

export const org = pgTable("org", {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name").notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    createdBy: serial('createdBy').notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const userOrganizations = pgTable('userOrganizations', {
    userId: serial('id').references(() => user.id),
    organizationId: uuid("id").references(() => org.id),
}, (table) => ({
    primaryKey: primaryKey({
        columns: [table.userId, table.organizationId]
    })
}));


export const orgInsertSchema = createInsertSchema(org)