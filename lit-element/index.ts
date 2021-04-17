import { Router } from "@vaadin/router";

window.addEventListener("load", () => {
    initRouter();
});

function initRouter() {
    const router = new Router(document.querySelector("main"));
    router.setRoutes([
        {
            path: "/",
            component: "lit-element",
        },
    ]);
}
