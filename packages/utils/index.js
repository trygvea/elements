import { LitElement, html } from 'lit';

export function classes(defn) {
  const classes = [];
  for (const [key, value] of Object.entries(defn)) {
    if (value) classes.push(key);
  }
  return classes.join(' ');
}

export class FabricWebComponent extends HTMLElement {
  constructor() {
    super();

    const fabricStylesTemplate = document.createElement('template');
    fabricStylesTemplate.innerHTML = `
            <style>:host { display: block; }</style>
            <link
                rel="stylesheet"
                type="text/css"
                href="https://assets.finn.no/pkg/@fabric-ds/css/v1/fabric.min.css"
            />
        `;

    this.attachShadow({ mode: 'open' }).appendChild(fabricStylesTemplate.content);
  }
}

export class FabricElement extends LitElement {
  get _fabricStylesheet() {
    return html`<link
      href="https://assets.finn.no/pkg/@fabric-ds/css/v1/fabric.min.css"
      rel="stylesheet"
      type="text/css"
    />`;
  }
}

export const windowExists = typeof window !== 'undefined';
