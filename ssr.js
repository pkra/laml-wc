import { parseHTML } from 'linkedom';
import fs from 'node:fs';

const {
    window, document, customElements,
    HTMLElement,
    Event, CustomEvent
} = parseHTML(fs.readFileSync('./m522.html').toString());


// make some globals so customelements.js can find it
globalThis.HTMLElement = HTMLElement;
globalThis.customElements = customElements;
globalThis.document =  document;

// upgrade/render our elements
await import('./customelements.js');

document.querySelectorAll('script').forEach(node => node.remove());

// save
fs.writeFileSync('m522-ssr.html', document.toString());
