import { finder } from "@medv/finder";
import { sendMessage, onMessage } from "webext-bridge/content-script";
export default defineContentScript({
  matches: ['*://*/*'],
  allFrames: true,
  async main(ctx) {
    onMessage("get-selector", ({ data }) => {
      const { element } = data;
      console.log("element", element);
      try {
        let selector = finder(element);
        if (selector) {
          sendMessage("selector-found", { selector });
        }
      } catch (error) {
        if (error instanceof Error) {
          sendMessage("selector-error", error);
        }
      }
      return {}
    });
  },
});
