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

// MathJax SSR
// triggers custom elements twice but will trigger them if run alone (how??)
// await import('./mj.js');

// add pagedjs
// document.querySelector('script[src="customelements.js"]').setAttribute('src', 'https://unpkg.com/pagedjs/dist/paged.polyfill.js');

// save
console.log(document.toString())
