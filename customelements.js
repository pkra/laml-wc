class chapter extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.setAttribute('role', 'doc-chapter');
  }
}
customElements.define('chapter-', chapter);

class name extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.setAttribute('role', 'heading');
    let level = 1;
    if (this.closest('chapter-')) level = 2;
    if (this.closest('section')) level = 3;
    this.setAttribute('aria-level', level);
  }
}
customElements.define('name-', name);

class statement extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback(name = 'Statement', selector) {
    if (selector !== false) selector = 'sec-'; // use `false` if you don't want a counter
    this.setAttribute('role', 'landmark'); // TODO:
    let resetElement = this.closest(selector); // selector determines where we reset
    let counter = '';
    if (resetElement) counter = ` ${(1 + [...resetElement.querySelectorAll(this.tagName)]?.indexOf(this))}`; // numeric counters only (for now)
    this.insertAdjacentHTML('afterbegin', `<statement-label>${name}${counter}</statement-label`)
  }
}
customElements.define('statement-', statement);

class theorem extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Theorem');
  }
}
customElements.define('thm-', theorem);

class lemma extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Lemma');
  }
}
customElements.define('lem-', lemma);

class definition extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Definition');
  }
}
customElements.define('defn-', definition);

class remark extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Remark');
  }
}
customElements.define('rem-', remark);

class exercise extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Exercise');
  }
}
customElements.define('exerc-', exercise);

class notes extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Notes');
  }
}
customElements.define('notes-', notes);

class example extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Example');
  }
}
customElements.define('example-', example);

class proposition extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Proposition');
  }
}
customElements.define('prop-', proposition);

class corollary extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Corollary');
  }
}
customElements.define('cor-', corollary);

class proof extends statement {
  constructor() {
    super()
  }
  connectedCallback() {
    super.connectedCallback('Proof', false);
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
    if (target?.querySelector('statement-label')) {
      anchorHtml = target.querySelector('statement-label').innerHTML;
    }
    else if (target?.querySelector('blame-')) { // only otherwise, use author-provided blame- / title [not both, it'll be too long]
      anchorHtml = target.querySelector('blame-')?.innerHTML;
    }
    else anchorHtml = `<mark>${targetId}$</mark>`; // if all else fails
    this.innerHTML = `<a href="#${targetId}">${anchorHtml}</a>`;
  }
}
customElements.define('ref-', crossreference);
