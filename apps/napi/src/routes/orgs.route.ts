import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { org, orgInsertSchema, project, user } from "@db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const route = new Hono<Env>()
    .get("/", async (ctx) => {
        const user = ctx.get("user")!
        const projects = await db.query.project.findMany({
            where: eq(project.userId, user.userId)
        })
        ctx.json(projects);
    })

    .get('/:id', async (ctx) => {
        const id = ctx.req.param("id");
        const user = ctx.get("user")!
        const _project = await db.query.project.findFirst({
            where: and(eq(project.id, id), eq(project.userId, user.userId))
        })
        ctx.json(_project)
    })

    .post("/create", zValidator("json",
        z.object({
            name: z.string().min(3).max(30)
        })), async (ctx) => {
            const data = ctx.req.valid("json");
            const user = ctx.get("user")!
            const createdOrg = await db.insert(org).values({
                name: data.name,
                createdBy: user.userId,
            }).returning().execute();
            return ctx.json(createdOrg);
        })

    .delete("/:id", async (ctx) => {
        const id = ctx.req.param("id");
        const user = ctx.get("user")!
        const deleted = await db.delete(org).where(and(eq(org.id, id), eq(org.createdBy, user.userId))).execute();
        ctx.json(deleted);
    })

    .put("/:id",
        zValidator("json", orgInsertSchema),
        async (ctx) => {
            const id = ctx.req.param("id");
            const data = ctx.req.valid("json");
            const user = ctx.get("user")!
            const updated = await db.update(org).set(data).where(and(eq(org.id, id), eq(org.createdBy, user.userId))).execute();
            ctx.json(updated);
        })
export default route