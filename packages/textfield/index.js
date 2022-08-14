import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fclasses, FabricElement } from '../utils';

class FabricTextField extends FabricElement {
  static properties = {
    disabled: { type: Boolean },
    invalid: { type: Boolean },
    id: { type: String },
    label: { type: String },
    helpText: { type: String, attribute: 'help-text' },
    max: { type: Number },
    min: { type: Number },
    minLength: { type: Number, attribute: 'min-length' },
    maxLength: { type: Number, attribute: 'max-length' },
    name: { type: String },
    pattern: { type: String },
    placeholder: { type: String },
    readOnly: { type: Boolean, attribute: 'read-only' },
    required: { type: Boolean },
    type: { type: String },
    value: { type: String },
  };

  // Slotted elements remain in lightDOM which allows for control of their style outside of shadowDOM.
  // ::slotted([Simple Selector]) confirms to Specificity rules, but (being simple) does not add weight to lightDOM skin selectors,
  // so never gets higher Specificity. Thus in order to overwrite style linked within shadowDOM, we need to use !important.
  // https://stackoverflow.com/a/61631668
  static styles = css`
    :host {
      display: block;
    }
    ::slotted(:last-child) {
      margin-bottom: 0px !important;
    }
  `;

  constructor() {
    super();
    this.type = 'text';
  }

  get _outerWrapperStyles() {
    return fclasses({
      // 'has-suffix': hasSuffix,
      // 'has-prefix': hasPrefix,
    });
  }

  get _innerWrapperStyles() {
    return fclasses({
      'input mb-0': true,
      'input--is-invalid': this.invalid,
      'input--is-disabled': this.disabled,
      'input--is-read-only': this.readOnly,
    });
  }

  get _label() {
    if (this.label) {
      return html`<label for="${this._id}">${this.label}</label>`;
    }
  }

  get _helpId() {
    if (this.helpText) return `${this._id}__hint`;
  }

  get _id() {
    return 'textfield';
  }

  get _error() {
    if (this.invalid && this._helpId) return this._helpId;
  }

  blurHandler(e) {
    this.dispatchEvent(new CustomEvent('blur'));
  }

  changeHandler(e) {
    this.dispatchEvent(new CustomEvent('change'));
  }

  focusHandler(e) {
    this.dispatchEvent(new CustomEvent('focus'));
  }

  render() {
    return html`
      ${this._fabricStylesheet}
      <div class="${this._outerWrapperStyles}">
        <div class="${this._innerWrapperStyles}">
          ${this._label}
          <div class="relative">
            <input
              type="${this.type}"
              min="${ifDefined(this.min)}"
              max="${ifDefined(this.max)}"
              minlength="${ifDefined(this.minLength)}"
              maxlength="${ifDefined(this.maxLength)}"
              name="${ifDefined(this.name)}"
              pattern="${ifDefined(this.pattern)}"
              placeholder="${ifDefined(this.placeholder)}"
              value="${ifDefined(this.value)}"
              aria-describedby="${ifDefined(this._helpId)}"
              aria-errormessage="${ifDefined(this._error)}"
              aria-invalid="${ifDefined(this.invalid)}"
              id="${this._id}"
              ?disabled="${this.disabled}"
              ?readonly="${this.readOnly}"
              ?required="${this.required}"
              @onBlur=${this.blurHandler}
              @onChange=${this.changeHandler}
              @onFocus=${this.focusHandler}
            />
            <slot></slot>
          </div>
          ${this.helpText &&
          html`<div class="input__sub-text" id="${this._helpId}">${this.helpText}</div>`}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('f-textfield')) {
  customElements.define('f-textfield', FabricTextField);
}

export { FabricTextField };
