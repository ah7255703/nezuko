import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import usersRoutes from './routes/users.route.js'
import { socket } from './socket.js'

const app = new Hono()

const routes = app.get('/', (c) => {
  return c.json({
    message: "pong"
  })
})
  .route("/", usersRoutes)


export type BackendRoutes = typeof routes

const port = 3000

const server = serve({
  fetch: app.fetch,
  port
})

socket.listen(server)