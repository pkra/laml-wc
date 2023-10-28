class chapter extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'landmark doc-chapter');
  }
}
customElements.define('chapter-', chapter);

class name extends HTMLElement {
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
  connectedCallback(name = 'Statement') {
    this.setAttribute('role','landmark');
    if (this.firstChild && this.firstChild.tagName === "B") return;
    const heading = document.createElement('b');
    heading.innerHTML = name;
    this.insertBefore(heading, this.firstChild);
  }
}
customElements.define('statement-', statement);

class theorem extends statement {
  connectedCallback() {
    super.connectedCallback('Theorem');
  }
}
customElements.define('thm-', theorem);

class lemma extends statement {
  connectedCallback() {
    super.connectedCallback('Lemma');
  }
}
customElements.define('lem-', lemma);

class definition extends statement {
  connectedCallback() {
    super.connectedCallback('Definition');
  }
}
customElements.define('defn-', definition);

class remark extends statement {
  connectedCallback() {
    super.connectedCallback('Remark');
  }
}
customElements.define('rem-', remark);

class exercise extends statement {
  connectedCallback() {
    super.connectedCallback('Exercise');
  }
}
customElements.define('exerc-', exercise);

class notes extends statement {
  connectedCallback() {
    super.connectedCallback('Notes');
  }
}
customElements.define('notes-', notes);

class example extends statement {
  connectedCallback() {
    super.connectedCallback('Example');
  }
}
customElements.define('example-', example);

class proposition extends statement {
  connectedCallback() {
    super.connectedCallback('Proposition');
  }
}
customElements.define('prop-', proposition);

class corollary extends statement {
  connectedCallback() {
    super.connectedCallback('Corollary');
  }
}
customElements.define('cor-', corollary);

class proof extends statement {
  connectedCallback() {
    super.connectedCallback('Proof');
  }
}
customElements.define('proof-', proof);

class bibliography extends HTMLElement {
  connectedCallback() {
    this.appendChild(style);
  }
}

class bibitem extends HTMLElement {
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
  connectedCallback() {
    const anchor = document.createElement('a');
    const targetId = this.getAttribute('target');
    anchor.setAttribute('href', '#' + targetId);
    const target = document.getElementById(targetId);
    if (target && target.querySelector('name-')) anchor.innerHTML = target.querySelector('name-').innerHTML;
    else anchor.innerHTML = targetId;
    this.innerHTML = '';
    this.appendChild(anchor);
  }
}
customElements.define('ref-', crossreference);
