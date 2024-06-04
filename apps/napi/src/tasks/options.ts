import { QueueSettings } from "bee-queue";
import { redis } from "../services/redis.service";

export const options: QueueSettings = {
    redis: redis,
    storeJobs: true,
    autoConnect: true,
    removeOnSuccess: false,
    ensureScripts: true,
}