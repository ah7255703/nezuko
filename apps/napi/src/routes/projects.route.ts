import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { eq } from "drizzle-orm";
import { project } from "@db/schema";

const route = new Hono<Env>()
    .get(':orgId/getAll', async (ctx) => {
        const { orgId } = ctx.req.param();
        const data = await db.query.project.findMany({
            where: eq(project.org, orgId)
        });
        return ctx.json(data);
    })

export default route