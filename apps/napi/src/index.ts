import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import usersRoutes from './routes/users.route.js'
import { socket } from './socket.js'

const app = new Hono()
app.use(logger())
const routes = app.get('/', (c) => {
  return c.json({
    message: "pong"
  })
})
  .route("/", usersRoutes)


export type BackendRoutes = typeof routes

const port = 3001

const server = serve({
  fetch: app.fetch,
  port
})

socket.listen(server)