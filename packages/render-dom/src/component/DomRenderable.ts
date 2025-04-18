import { Component } from "@snaekit/ecs";

export class DomRenderable extends Component {
	constructor(
		public readonly element: HTMLElement = document.createElement("div"),
	) {
		super();
	}

	styled(styles: Partial<CSSStyleDeclaration>) {
		Object.assign(this.element.style, styles);

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
}
