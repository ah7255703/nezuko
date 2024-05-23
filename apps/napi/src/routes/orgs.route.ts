import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { org, orgInsertSchema, orgMembers } from "@db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const route = new Hono<Env>()
    .get("/getAll", async (ctx) => {
        const user = ctx.get("user")!
        const orgs = await db.query.org.findMany({
            where: eq(org.createdBy, user.userId)
        })
        return ctx.json(orgs);
    })

    .get('/:id', async (ctx) => {
        const id = ctx.req.param("id");
        const _org = await db.query.org.findFirst({
            where: and(eq(org.id, id))
        });
        return ctx.json(_org)
    })

    .post("/create", zValidator("json",
        z.object({
            name: z.string().min(3).max(30)
        })), async (ctx) => {
            const data = ctx.req.valid("json");
            const user = ctx.get("user")!
            const result = await db.transaction(async (tx) => {
                const query1 = await db.insert(org).values({
                    name: data.name,
                    createdBy: user.userId,
                }).returning();
                const createdOrg = query1.at(0);
                if (createdOrg) {
                    const member = await db.insert(orgMembers).values({
                        orgId: createdOrg.id,
                        userId: user.userId,
                        role: "admin"
                    }).returning();
                    return { org: createdOrg, member: member.at(0) }
                } else {
                    tx.rollback();
                    return null
                }
            })
            if (!result) {
                return ctx.json({
                    message: "Failed to create org",
                })
            }
            return ctx.json(result);
        })

    .delete("/:id", async (ctx) => {
        const id = ctx.req.param("id");
        const user = ctx.get("user")!
        const deleted = await db.delete(org).where(and(eq(org.id, id), eq(org.createdBy, user.userId))).returning();
        return ctx.json(deleted.at(0));
    })

    .put("/:id",
        zValidator("json", orgInsertSchema),
        async (ctx) => {
            const id = ctx.req.param("id");
            const data = ctx.req.valid("json");
            const user = ctx.get("user")!
            const updated = await db.update(org).set(data).where(and(eq(org.id, id), eq(org.createdBy, user.userId))).execute();
            return ctx.json(updated);
        })
export default route