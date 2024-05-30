import { Hono } from "hono";
import { Env } from "../types";
import { streamText } from "hono/streaming"
// SSE implementation

const route = new Hono<Env>()
    .get("/", async (ctx) => {
        return streamText(ctx, async (st) => {
            st.onAbort(() => {
                console.log("Client disconnected")
            })
            await st.write("data: Hello\n\n")
            await st.sleep(1000) 
            await st.write("data: Hello\n\n")
            await st.sleep(1000) 
            await st.write("data: Hello\n\n")
            await st.sleep(1000) 
            await st.write("data: Hello\n\n")
            
        })
    })
export default route;