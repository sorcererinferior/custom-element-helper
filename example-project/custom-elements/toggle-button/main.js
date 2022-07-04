import { upgradeProperty, getTemplateElement } from "https://cdn.jsdelivr.net/gh/sorcererinferior/custom-element-helper/ce-helper.js";

// THIS IS ALL THIS HELPER IS ABOUT
const template = await getTemplateElement(import.meta);
// it embeds style.css automatically inside template


// and the rest is directly from Google! (except upgradeProperty is not defined in class, used from import)
const KEYCODE = {
    SPACE: 32,
    ENTER: 13,
};

export class HowToToggleButton extends HTMLElement {
    static get observedAttributes() {
        return ["pressed", "disabled"]
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
            .append(
                template.content.cloneNode(true)
            );
    }

    connectedCallback() {
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex'))
            this.setAttribute('tabindex', 0);
        if (!this.hasAttribute('aria-pressed'))
            this.setAttribute('aria-pressed', 'false');

        upgradeProperty(this, "pressed");
        upgradeProperty(this, "disabled");

        this.addEventListener('keydown', this._onKeyDown);
        this.addEventListener('click', this._onClick);
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this._onKeyDown);
        this.removeEventListener('click', this._onClick);
    }

    set pressed(value) {
        const isPressed = Boolean(value);
        if (isPressed)
            this.setAttribute('pressed', '');
        else
            this.removeAttribute('pressed');
    }

    get pressed() {
        return this.hasAttribute('pressed');
    }

    set disabled(value) {
        const isDisabled = Boolean(value);
        if (isDisabled)
            this.setAttribute('disabled', '');
        else
            this.removeAttribute('disabled');
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        const hasValue = newValue !== null;
        switch (name) {
            case 'pressed':
                this.setAttribute('aria-pressed', hasValue);
                break;
            case 'disabled':
                this.setAttribute('aria-disabled', hasValue);
                if (hasValue) {
                    this.removeAttribute('tabindex');
                    this.blur();
                } else {
                    this.setAttribute('tabindex', '0');
                }
                break;
        }
    }

    _onKeyDown(event) {
        if (event.altKey)
            return;
        switch (event.keyCode) {
            case KEYCODE.SPACE:
            case KEYCODE.ENTER:
                event.preventDefault();
                this._togglePressed();
                break;
            default:
                return;
        }
    }

    _onClick(event) {
        this._togglePressed();
    }

    _togglePressed() {
        if (this.disabled)
            return;
        this.pressed = !this.pressed;
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                pressed: this.pressed,
            },
            bubbles: true,
        }));
    }
}
