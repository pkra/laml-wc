class chapter extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.setAttribute('role', 'doc-chapter');
  }
}
customElements.define('chapter-', chapter);

class heading extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.setAttribute('role', 'heading');
    let level = 1;
    let parentTagName = this.parentNode.tagName;
    if (parentTagName === 'chapter-') level = 2;
    if (parentTagName === 'section') level = 3;
    this.setAttribute('aria-level', level);
  }
}
customElements.define('h-', heading);

class enunciation extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback(name = 'enunciation', selector) {
    if (selector !== false) selector = 'section'; // use `false` if you don't want a counter TODO: was used for proof- but no longer used there cf. #6
    this.setAttribute('role', 'landmark'); // TODO:
    let resetElement = this.closest(selector); // selector determines where we reset
    let counter = '';
    if (resetElement) counter = ` ${(1 + [...resetElement.querySelectorAll(this.tagName)]?.indexOf(this))}`; // numeric counters only (for now)
    this.insertAdjacentHTML('afterbegin', `<enunciation-label>${name}${counter}</enunciation-label>`)
  }
}
customElements.define('enunciation-', enunciation);

const enunciationBasicMixin = (superClass, title) => class extends superClass {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback(title);
  }
}

customElements.define('thm-', enunciationBasicMixin(enunciation, 'Theorem'));
customElements.define('lem-', enunciationBasicMixin(enunciation, 'Lemma'));
customElements.define('defn-', enunciationBasicMixin(enunciation, 'Definition'));
customElements.define('rem-', enunciationBasicMixin(enunciation, 'Remark'));
customElements.define('exerc-', enunciationBasicMixin(enunciation, 'Enunciation'));
customElements.define('notes-', enunciationBasicMixin(enunciation, 'Notes'));
customElements.define('example-', enunciationBasicMixin(enunciation, 'Example'));
customElements.define('prop-', enunciationBasicMixin(enunciation, 'Proposition'));
customElements.define('cor-', enunciationBasicMixin(enunciation, 'Corollary'));

class proof extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    if (this.firstElementChild?.tagName !== 'PROOF-LABEL') {
      this.insertAdjacentHTML('afterbegin', `<proof-label>Proof.</proof-label>`);
    }
  }
}
customElements.define('proof-', proof);

class bibliography extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.appendChild(style);
  }
}

class bibitem extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', this.getAttribute('href'));
    anchor.innerHTML = this.innerHTML;
    this.innerHTML = '';
    this.appendChild(anchor);
  }
}
customElements.define('bi-', bibitem);

class cite extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', '#' + this.getAttribute('target'));
    if (/^\s*$/.test(this.innerHTML)) anchor.innerHTML = this.getAttribute('target');
    else {
      anchor.innerHTML = this.innerHTML
      this.innerHTML = '';
    };
    this.appendChild(anchor);

  }
}
customElements.define('cite-', cite);

class crossreference extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    const targetId = this.getAttribute('target');
    let anchorHtml = '';
    const target = document.getElementById(targetId);
    // if we have a label, use that
    if (target?.querySelector('enunciation-label')) {
      anchorHtml = target.querySelector('enunciation-label').innerHTML;
    }
    else if (target?.querySelector('blame-')) { // only otherwise, use author-provided blame- / title [not both, it'll be too long]
      anchorHtml = target.querySelector('blame-')?.innerHTML;
    }
    else anchorHtml = `<mark>${targetId}$</mark>`; // if all else fails
    this.innerHTML = `<a href="#${targetId}">${anchorHtml}</a>`;
  }
}
customElements.define('ref-', crossreference);
