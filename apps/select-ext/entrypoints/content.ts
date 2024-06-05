import { sendMessage, onMessage } from "webext-bridge/content-script";

export default defineContentScript({
  matches: ['*'],
  main(ctx) {
    console.log("content loaded");
    onMessage("get-preferences", ({ data }) => {
      console.log("get-preferences");
    });
  },
});
