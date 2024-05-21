import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './user';


export const org = pgTable("org", {
    id: uuid("id").primaryKey(),
    name: varchar("name").notNull(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    createdBy: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const orgRelations = relations(org, ({ one, many }) => ({
    creator: one(user, {
        references: [user.id],
        fields: [org.createdBy]
    })
}))