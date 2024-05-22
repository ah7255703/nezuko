import { serverApiReq } from "@/client/server-req";

export default async function Web() {
  const resp = await (await serverApiReq.index.$get()).json()
  return resp.message;
}
