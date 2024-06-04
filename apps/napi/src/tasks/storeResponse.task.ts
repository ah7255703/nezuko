import BeeQueue, { DoneCallback, Job } from "bee-queue";
import { options } from "./options";
import loggerService from "../services/logger.service";
import { db } from "@db/index";
import { projectResponse, projectResponseEnv } from "@db/schema";
import { createSchema } from 'genson-js';
import {
    quicktype,
    InputData,
    JSONSchemaInput,
    FetchingJSONSchemaStore
} from "quicktype-core";
async function schemaToTs(schema: string, name: string) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
    await schemaInput.addSource({ name, schema });
    const inputData = new InputData();
    inputData.addInput(schemaInput);
    let qt =  await quicktype({
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
    response: string;
    env: typeof projectResponseEnv.enumValues[number]
}

type DoneData = {
    success: boolean;
}

const storeResponseQueue = new BeeQueue<JobData>('process-video', options);

storeResponseQueue.process(async (job: Job<JobData>, done: DoneCallback<DoneData>) => {
    try {
        loggerService.info.info("started [storeResponseQueue.process]")
        let { projectId, response, env } = job.data;
        let jsonSchema = JSON.stringify(createSchema(response));
        let ts = await schemaToTs(jsonSchema, "Response")
        let query = await db.insert(projectResponse).values({
            projectId,
            response,
            env,
            responseShape: jsonSchema,
            responseTsInterface: ts
        }).returning();
        let result = query.at(0);
        if (!result) {
            throw new Error("failed to store response");
        }
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