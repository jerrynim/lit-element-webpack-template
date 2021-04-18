import { LitElement, html, customElement } from "lit-element";
import resetCss from "../styles/resetCss";

@customElement("lit-element")
class Element extends LitElement {
    render() {
        return html`
            <style>
                ${resetCss}
            </style>
            <h1>안녕하세요,Hello lit-element</h1>
            <img src="/go10.png" />
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lit-element": Element;
    }
}
