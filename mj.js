import { mathjax } from 'mathjax-full/js/mathjax.js';
mathjax.asyncLoad = async (name) => import(name + '.js');
import 'mathjax-full/js/input/tex/AllPackages.js';// import all so that they're imported and MathJax will load them when we specify them in the TeX input packages field below
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { linkedomAdaptor } from 'mathjax-full/js/adaptors/linkedomAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { parseHTML } from 'linkedom';

import fs from 'node:fs';


const {
    window, document, customElements,
    HTMLElement,
    Event, CustomEvent
} = parseHTML(fs.readFileSync('./m522-ssr.html').toString());


// mathjax needs this for TeX pre-processing
window.Text.prototype.splitText = function (offset) {
    const [start, end] = (() => {
      if (offset <= 0) return ['', this.data];
      if (offset >= this.data.length) return [this.data, ''];
      return [
        this.data.substring(0, offset),
        this.data.substring(offset),
      ];
    })();
  
    const newNode = document.createTextNode(end);
    this.parentNode.insertBefore(newNode, this.nextSibling);
    this.data = start;
    return newNode;
  };
//
//  Create DOM adaptor and register it for HTML documents
//
const adaptor = linkedomAdaptor(parseHTML);
RegisterHTMLHandler(adaptor);

//
//  Create input and output jax and a document using them on the content from the HTML file
//
const tex = new TeX({ 
    inlineMath: [['$', '$'], ['\\(', '\\)']], 
    packages: ['base', 'autoload', 'require', 'ams', 'newcommand'] });
import { MathJaxModernFont } from 'mathjax-modern-font/mjs/svg.js';
const modernFont = new MathJaxModernFont({
    dynamicPrefix: 'mathjax-modern-font/mjs/svg/dynamic'
});
const svg = new SVG({
    fontData: modernFont,
    fontCache: 'global'
});
const html = mathjax.document(document, { InputJax: tex, OutputJax: svg });

//
//  Typeset the document
//
await mathjax.handleRetriesFor(() => html.render());

//
//  If no math was found on the page, remove the stylesheet and font cache (if any)
//
if (Array.from(html.math).length === 0) {
    adaptor.remove(html.outputJax.svgStyles);
    const cache = adaptor.elementById(adaptor.body(html.document), 'MJX-SVG-global-cache');
    if (cache) adaptor.remove(cache);
}

//
//  Output the resulting HTML
//
// console.log(adaptor.doctype(html.document));
// console.log(adaptor.outerHTML(adaptor.root(html.document)));
fs.writeFileSync('m522-ssr.html', document.toString().replace('stroke-width: 3;','stroke-width: 0;'));


// save print version
// fs.writeFileSync('print.html', document.toString().replace('</body>', '<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script></body>'));
