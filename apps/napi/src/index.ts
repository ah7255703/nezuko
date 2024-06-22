import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import usersRoutes from './routes/users.route.js'
import privateUsersRoutes from './routes/users.private.route.js'
import projectsRoutes from './routes/projects.route.js'
import sseRoutes from './routes/events.route.js'
import orgsRoutes from './routes/orgs.route.js'
import publicRoutes from './routes/public.route.js'
import { socket } from './socket.js'
import { Env } from './types.js'
import { authService, InvalidTokenError } from './services/auth.service.js'
import { HTTPException } from 'hono/http-exception';
import logger from './services/logger.service.js'
import { cors } from 'hono/cors'
import { processWebpage } from './scraper/index.js'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { cacheService } from './services/redis.service.js'

const app = new Hono<Env>({
  strict: true,
});
app.use(cors())
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
      if (error instanceof InvalidTokenError) {
        ctx.header("X-Invalid-Token", "true");
      } else {
        console.log(error)
      }
    }
  }
  ctx.header("X-Authenticated", String(ctx.get("user") !== null));
  logger.info.log("info", `[USER]:${JSON.stringify(ctx.get("user"))}`)
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

const secured = new Hono<Env>()
  .route("/org", orgsRoutes)
  .route("/", privateUsersRoutes)
  .route('/projects', projectsRoutes)

const routes = app
  .post('/scrape', zValidator("json", z.object({
    url: z.string(),
    shape: z.any()
  })), async (ctx) => {
    const { url, shape } = ctx.req.valid('json');
    const data = await processWebpage({
      schema: shape,
      url
    })
    return ctx.json(data)
  })
  .route('/credentials', usersRoutes)
  .route("/secured", secured)
  .route("/events", sseRoutes)
  .route("/project", publicRoutes)
  .get("/health", async (ctx) => {
    return ctx.json({ status: "ok" })
  })
  .get("/proxy", async (ctx) => {
    const query = ctx.req.query();
    const res = await fetch(query.url);
    ctx.res.headers.set('Content-Type', 'text/html');
    ctx.res.headers.set('X-Frame-Options', 'ALLOWALL');
    ctx.res.headers.set('Access-Control-Allow-Origin', '*');
    ctx.res.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    ctx.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return ctx.html(await res.text())
  })

export type BackendRoutes = typeof routes
async function preStart() {
  await cacheService.connect()
}
const port = 3001
const server = serve({
  fetch: app.fetch,
  port
}, (info) => {
  preStart()
  logger.info.log("info", `[SERVER]:server is running on port ${info.port}`)
})

socket.listen(server)