import { Router } from "@vaadin/router";
import "./styles/resetCss.css";

window.addEventListener("load", () => {
    initRouter();
});

function initRouter() {
    const router = new Router(document.querySelector("main"));
    router.setRoutes([
        {
            path: "/",
            component: "lit-element",
            action: () => {
                import("./components//lit-element");
            },
        },
    ]);
}
