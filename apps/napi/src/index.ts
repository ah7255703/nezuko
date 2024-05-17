import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import usersRoutes from './routes/users.route.js'
import { socket } from './socket.js'
import { Env } from './types.js'
import { authService } from './services/auth.service.js'

const app = new Hono<Env>();

app.use(logger())

app.use(async (ctx, next) => {
  ctx.set("user", null);
  const authorization = ctx.req.header('authorization');
  console.log("authorization", authorization)
  if (authorization) {
    const [, token] = authorization.split('  ');
    try {
      const payload = await authService.jwtPayload(token);
      ctx.set("user", payload);
    } catch (error) {
      console.log(error)
    }
  }
  ctx.header("X-Authenticated", String(ctx.get("user") !== null));
  await next();
})

app.use("/secured/*", async (ctx, next) => {
  if (ctx.get("user") === null) {
    return ctx.json({ message: "Unauthorized" }, 401);
  }
  await next();
})

const secured = new Hono<Env>();

secured.get("/whoami", async (ctx) => {
  return ctx.json(ctx.get("user"));
})

const routes = app.get('/', (c) => {
  return c.json({
    message: "pong"
  })
})
  .route("/", usersRoutes)
  .route("/secured", secured)


export type BackendRoutes = typeof routes

const port = 3001

const server = serve({
  fetch: app.fetch,
  port
})

socket.listen(server)