import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { project } from "@db/schema";
import { eq } from "drizzle-orm";
import { cacheService } from "../services/redis.service";
import { processWebpage } from "../scraper";
import { pushStoreResponseTask } from "../tasks/storeResponse.task";

async function getProjectById(projectId: string, noCache?: boolean) {
    const cacheKey = `project:${projectId}`;
    const cached = await cacheService.get(cacheKey);
    if (cached && !noCache) {
        return JSON.parse(cached) as typeof project.$inferSelect;
    }
    const dbData = await db.query.project.findFirst({
        where: eq(project.id, projectId)
    });
    await cacheService.setEx(cacheKey, 30, JSON.stringify(dbData));
    return dbData;
}

async function processProject(p: typeof project.$inferSelect, noCache?: boolean) {
    // noCache => don't get from cache
    const cacheKey = `processed:${p.id}`;
    const cached = await cacheService.get(cacheKey)

    if (cached && !noCache) {
        return JSON.parse(cached)
    }

    let d = await processWebpage({
        url: p.request.url,
        schema: p.schema,
        headers: p.request.headers,
    })

    await pushStoreResponseTask({
        projectId: p.id,
        response: d,
        env: "prod"
    })

    await cacheService.setEx(cacheKey, 30, JSON.stringify(d));
    return d;
}

const route = new Hono<Env>()
    .post(':projectId', async (ctx) => {
        const noCache = ctx.req.header('X-No-Cache') === 'true';
        const token = ctx.req.header('X-Token');
        const { projectId } = ctx.req.param();
        const project = await getProjectById(projectId, noCache);
        if (!project) {
            throw new Error('Project not found');
        }
        const processed = await processProject(project, noCache);

        return ctx.json(processed);
    })
export default route;