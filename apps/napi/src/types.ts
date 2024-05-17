import { JWTPayload } from "./services/auth.service"

export type Env = {
    Variables: {
        user: JWTPayload | null
    }
}