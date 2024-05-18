import { hc } from "hono/client";
import { BackendRoutes } from '../../napi/src/index'

const BACKEND_URL = "http://localhost:3001/"

export const api = hc<BackendRoutes>(BACKEND_URL)
