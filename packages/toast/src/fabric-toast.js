import { FabricWebComponent } from '../../utils';
import { classNames } from '@chbphone55/classnames';
import { toast as c } from '@finn-no/fabric-component-classes';
import { expand, collapse } from 'element-collapse';
import { useToast } from './api';

const ALLOWED_TYPES = ['success', 'warning', 'error', 'info'];
export class FabricToast extends FabricWebComponent {
    static get observedAttributes() {
        return ['type', 'text', 'duration', 'canclose', 'onclose'];
    }

    connectedCallback() {
        this.isProgrammatic = !!this.getAttribute('programmatic');
        this.id = this.getAttribute('id');
        this.type = this.getAttribute('type');
        this.duration = this.getAttribute('duration');
        this.onclose = this.getAttribute('onClose');
        this.canclose = this.getAttribute('canClose');

        if (this.isProgrammatic && !ALLOWED_TYPES.includes(this.type)) {
            throw new Error(
                `Invalid toast type. Allowed types: ${ALLOWED_TYPES.reduce(
                    (acc, curr, i) =>
                        [acc, curr].join(
                            i === ALLOWED_TYPES.length - 1 ? ' or ' : ', ',
                        ),
                )}`,
            );
        }

        this.render();

        if (
            document.readyState === 'complete' ||
            document.readyState === 'loaded'
        ) {
            this.handleSetup();
        } else {
            document.addEventListener('DOMContentLoaded', this.handleSetup());
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`this[${name}] = ${newValue};`);
        this[name] = newValue;

        this.render(true);
    }

    handleSetup() {
        const { removeToast } = useToast();

        const el = this.shadowRoot.getElementById(`toast-${this.id}-wrapper`);
        const button = this.shadowRoot.getElementById(
            `toast-${this.id}-button`,
        );

        if (button) {
            const handleClose = () => {
                new Function('return ' + this.onclose)();
                if (this.isProgrammatic) {
                    el && collapse(el);
                    setTimeout(() => {
                        removeToast(this.id);
                    }, 1000);
                }
            };
            button.addEventListener('click', handleClose);
        }

        // Expand element on mount
        if (this.isProgrammatic && el) {
            expand(el);
        }

        // If a duration is passed, handle auto dismiss
        if ((this.duration || this.isProgrammatic) && el) {
            if (this.duration === '0') return;

            setTimeout(() => {
                collapse(el);
            }, Number(this.duration));

            setTimeout(() => {
                removeToast(this.id);
            }, Number(this.duration) + 1000);
        }
    }

    render(updated) {
        const exists = this.shadowRoot.getElementById(
            `toast-${this.id}-wrapper`,
        );

        const isProgrammatic = !!this.getAttribute('programmatic');
        const isSuccess = this.type === 'success';
        const isWarning = this.type === 'warning';
        const isError = this.type === 'error';
        const isInfo = this.type === 'info';

        if (exists) {
            exists.remove();
        }

        this.shadowRoot.innerHTML += `
            <div
                ${this.id ? `id="toast-${this.id}-wrapper"` : ''}
                ${isProgrammatic && !updated ? "style='height: 0;'" : ''}
                class="${c.toastWrapper}"
                role="status"
                aria-live="polite"
            >
                <div
                    class="${classNames({
                        [c.toast]: true,
                        [c.toastPositive]: isSuccess,
                        [c.toastWarning]: isWarning,
                        [c.toastNegative]: isError,
                        [c.toastNeutral]: isInfo,
                    })}"
                >
                    <div
                        class="${classNames({
                            [c.toastIcon]: true,
                            [c.toastIconPositive]: isSuccess,
                            [c.toastIconWarning]: isWarning,
                            [c.toastIconNegative]: isError,
                            [c.toastIconNeutral]: isInfo,
                        })}"
                    >
                        ${
                            isSuccess
                                ? `
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 16 16"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M5.5 9l2 1.5L11 6"
                            />
                        </svg>`
                                : `
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 16 16"
                            class="${classNames(
                                'transition-transform duration-200',
                                {
                                    'transform-rotate-180': isInfo,
                                },
                            )}"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-miterlimit="10"
                                stroke-width="1.5"
                                d="M8 9V4"
                            />
                            <circle
                                cx="8"
                                cy="11.8"
                                r=".8"
                                fill="currentColor"
                            />
                        </svg>`
                        }
                    </div>
                    <div class="${c.toastContent}">
                        <p ${this.id ? `id="toast-${this.id}-text"` : ''}>${
            this.text
        }</p>
                    </div>
                    ${
                        this.canclose
                            ? `
                            <button
                                ${this.id ? `id="toast-${this.id}-button"` : ''}
                                class="${c.toastClose}"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fill="currentColor"
                                        fill-rule="evenodd"
                                        d="M4.03 2.97a.75.75 0 00-1.06 1.06L6.94 8l-3.97 3.97a.75.75 0 101.06 1.06L8 9.06l3.97 3.97a.75.75 0 101.06-1.06L9.06 8l3.97-3.97a.75.75 0 00-1.06-1.06L8 6.94 4.03 2.97z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>`
                            : ``
                    }
                </div>
            </div>
        `;
    }
}
