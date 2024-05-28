import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { eq } from "drizzle-orm";
import { project } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const route = new Hono<Env>()
    .get(':orgId/getAll', async (ctx) => {
        const { orgId } = ctx.req.param();
        const data = await db.query.project.findMany({
            where: eq(project.org, orgId)
        });
        return ctx.json(data);
    })
    .post(':orgId/create', zValidator("json", z.object({
        title: z.string()
    })), async (ctx) => {
        const { title } = ctx.req.valid('json');
        const { orgId } = ctx.req.param()
        const user = ctx.get('user')!;
        const d = await db.insert(project)
            .values({
                name: title,
                org: orgId,
                createdBy: user.userId,
            }).returning()

        return ctx.json(d.at(0))
    })
    .get(':projectId', async (ctx) => {
        const {  projectId } = ctx.req.param();
        const data = await db.query.project.findFirst({
            where: eq(project.id, projectId)
        });
        return ctx.json(data);
    })

export default route