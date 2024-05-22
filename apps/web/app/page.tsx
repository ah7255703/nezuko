import { api } from "@/client"

export default async function Web() {
  const resp = await (await api.index.$get()).json()
  return resp.message;
}
