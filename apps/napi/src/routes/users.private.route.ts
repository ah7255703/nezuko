import { Hono } from "hono";
import { Env } from "../types";

const route = new Hono<Env>()
    .get("/whoami", async (ctx) => {
        return ctx.json(ctx.get("user"));
    });

export default route;