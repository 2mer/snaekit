import { Component } from "@snaekit/ecs";

export class DomRenderable extends Component {
	public _layer?: HTMLElement;

	constructor(
		public readonly element: HTMLElement = document.createElement("div"),
	) {
		super();
	}

	styled(styles: Partial<CSSStyleDeclaration>) {
		Object.entries(styles).forEach(([k, v]) => {
			if (!v) {
				this.element.style.setProperty(k, null);
				return;
			}
			this.element.style.setProperty(k, String(v));
		});

		return this;
	}

	cls(...classes: string[]) {
		this.element.classList.add(...classes);

		return this;
	}

	uncls(...classes: string[]) {
		this.element.classList.remove(...classes);

		return this;
	}

	layer(layer: HTMLElement) {
		this._layer = layer;
		return this;
	}
}
