import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import { sendMessage } from "webext-bridge/devtools";

function App() {
    return <div>
        <button className="p-2" onClick={async () => {
            await sendMessage("get-preferences", {});
            await sendMessage("get-preferences", {}, {
                context: "content-script",
                tabId: browser.devtools.inspectedWindow.tabId,
            });
        }}>
            send message
        </button>
    </div>
}
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);