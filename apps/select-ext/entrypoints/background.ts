import "webext-bridge/background";
import { onMessage } from "webext-bridge/background";

export default defineBackground({
  type: "module",
  main() {
    console.log("background loaded");
    onMessage("get-preferences", ({ data }) => {
      console.log("get-preferences", data);
    });
  },
})

