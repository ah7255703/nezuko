import BeeQueue, { DoneCallback, Job } from "bee-queue";
import { options } from "./options";
import loggerService from "../services/logger.service";
import { db } from "@db/index";
import { project, projectResponse, projectResponseEnv } from "@db/schema";
import { createSchema } from 'genson-js';
import {
    quicktype,
    InputData,
    JSONSchemaInput,
    FetchingJSONSchemaStore
} from "quicktype-core";
import { eq, sql } from "drizzle-orm";
async function schemaToTs(schema: string, name: string) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
    await schemaInput.addSource({ name, schema });
    const inputData = new InputData();
    inputData.addInput(schemaInput);
    let qt = await quicktype({
        inputData,
        lang: "ts",
        rendererOptions: {
            "just-types": true
        }
    })
    return qt.lines.join("\n");
}
type JobData = {
    projectId: string;
    response: Record<string, any>;
    env: typeof projectResponseEnv.enumValues[number]
}

type DoneData = {
    success: boolean;
}

const storeResponseQueue = new BeeQueue<JobData>('process-video', options);

storeResponseQueue.process(async (job: Job<JobData>, done: DoneCallback<DoneData>) => {
    try {
        let { projectId, response, env } = job.data;
        let jsonSchema = createSchema(response)
        let ts = await schemaToTs(JSON.stringify(jsonSchema), "Response")
        let query = await db.insert(projectResponse).values({
            projectId,
            response: JSON.stringify(response),
            env,
            responseShape: JSON.stringify(jsonSchema),
            responseTsInterface: ts
        }).returning();

        let result = query.at(0);

        if (!result) {
            throw new Error("failed to store response");
        }

        await db.execute(sql`UPDATE project SET api_calls_count = api_calls_count + 1 WHERE id = ${projectId}`);

        done(null, {
            success: true
        });
    } catch (error) {
        if (error instanceof Error) {
            done(error);
        }
    }
});

storeResponseQueue.on('error', (error) => {
    loggerService.info.error("error [storeResponseQueue]");
});

storeResponseQueue.on("succeeded", async (s, result: DoneData) => {
    loggerService.info.info("succeeded [storeResponseQueue]", result);
})

export async function pushStoreResponseTask(data: JobData) {
    await storeResponseQueue.createJob(data).save();
}