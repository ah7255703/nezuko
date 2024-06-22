import { Hono } from "hono";
import { Env } from "../types";
import { db } from "@db/index";
import { and, count, eq, sql, sum, } from "drizzle-orm";
import { project, projectResponse, updateProjectSchema } from "@db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { processWebpage } from "../scraper";
import { pushStoreResponseTask } from "../tasks/storeResponse.task";
import { processWeb } from "hmd";

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
        const { projectId } = ctx.req.param();
        const data = await db.query.project.findFirst({
            where: eq(project.id, projectId)
        });
        return ctx.json(data);
    })
    .put(':projectId/update', zValidator("json", updateProjectSchema), async (ctx) => {
        const { projectId } = ctx.req.param();
        const data = ctx.req.valid('json');
        const d = await db.update(project).set(data as any)
            .where(eq(project.id, projectId))
            .returning()
        return ctx.json(d.at(0));
    })
    .post(':projectId/try', zValidator("json", z.object({
        schemaString: z.string(),
        request: z.object({
            method: z.string(),
            url: z.string()
        })
    })), async (ctx) => {
        const { projectId } = ctx.req.param();
        const { schemaString, request } = ctx.req.valid('json');
        const schema = JSON.parse(schemaString) as any;
        const response = await processWebpage({
            schema,
            url: request.url,
        }
        )
        await pushStoreResponseTask({
            projectId,
            response: response,
            env: "test"
        })
        return ctx.json({
            $_response: response,
        });
    })
    .post(':projectId/try_rust', zValidator("json", z.object({
        schemaString: z.string(),
        request: z.object({
            method: z.string(),
            url: z.string()
        })
    })), async (ctx) => {
        const { projectId } = ctx.req.param();
        const { schemaString, request } = ctx.req.valid('json');
        let response = await processWeb({
            url: request.url,
        }, schemaString);
        await pushStoreResponseTask({
            projectId,
            response: JSON.parse(response) as any,
            env: "test"
        })
        return ctx.json({
            $_response: response,
        });
    })
    .get(':projectId/responses', async (ctx) => {
        const { projectId } = ctx.req.param();
        // get last row
        const data = await db.query.projectResponse.findMany({
            where: and(
                eq(projectResponse.projectId, projectId),
            ),
            orderBy(fields, operators) {
                return operators.desc(projectResponse.createdAt)
            },
            limit: 1
        });
        return ctx.json(data);
    })
    .get(':projectId/stats', async (ctx) => {
        const { projectId } = ctx.req.param();
        const data = await db.query.project.findFirst({
            where: eq(project.id, projectId),
        });
        const projectDbUsage = await db.select({
            dbUsage: sum(sql`pg_column_size(project)`)
        }).from(project)
            .where(eq(project.id, projectId))
        console.log(projectDbUsage.at(0)?.dbUsage)
        const storedResponsesDbUsage = await db.select({
            dbUsage: sum(sql`pg_column_size(project_response)`)
        }).from(projectResponse)
            .where(eq(projectResponse.projectId, projectId))

        const storedResponsesCount = await db.select({
            count: count()
        }).from(projectResponse).where(eq(projectResponse.projectId, projectId))

        return ctx.json({
            apiCallsCount: data?.apiCallsCount ?? 0,
            storedResponsesCount: storedResponsesCount.at(0)?.count ?? 0,
            dbUsage: projectDbUsage.at(0)?.dbUsage ?? 0,
            storedResponsesDbUsage: storedResponsesDbUsage.at(0)?.dbUsage ?? 0,
        });
    })
    .delete(":projectId/erase_prev_responses", async (ctx) => {
        const { projectId } = ctx.req.param();

        const lastRow = db.$with('last_row').as(
            db.select({ id: sql`max(${projectResponse.createdAt})`.as('created_at') }).from(projectResponse)
        );
        await db.with(lastRow)
            .delete(projectResponse)
            .where(and(sql`${projectResponse.createdAt} != (select created_at from ${lastRow})`, eq(projectResponse.projectId, projectId)));
        return ctx.json({});
    })


export default route