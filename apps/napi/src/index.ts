import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import usersRoutes from './routes/users.route.js'
import { socket } from './socket.js'
import { Env } from './types.js'
import { authService } from './services/auth.service.js'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<Env>({
  strict: true,
});

app.use(logger())

class JWTConfig {
  static tokenStrings = '[A-Za-z0-9._~+/-]+=*'
  static PREFIX = 'Bearer'
  static prefix = "Bearer"
  static header = 'Authorization'
  static realm = "Secured API"
}

app.use(async (ctx, next) => {
  ctx.set("user", null);
  const authorization = ctx.req.header('authorization');
  if (authorization) {
    // split by space wether 2 or one space or more
    const [scheme, token] = authorization.split(' ');
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
    const res = new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': `${JWTConfig.prefix} realm="` + JWTConfig.realm + '"',
      },
    })
    throw new HTTPException(401, { res });
  }
  await next();
})

const secured = new Hono<Env>().basePath("/secured");

secured.get("/whoami", async (ctx) => {
  return ctx.json(ctx.get("user"));
})

const routes = app.get('/', (c) => {
  return c.json({
    message: "pong"
  })
})
  .route("/", usersRoutes)
  .route("/", secured)


export type BackendRoutes = typeof routes

const port = 3001

const server = serve({
  fetch: app.fetch,
  port
})

socket.listen(server)