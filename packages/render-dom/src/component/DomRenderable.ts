import { Component } from "@snaekit/ecs";

export class DomRenderable<T extends HTMLElement> extends Component {
	constructor(public readonly element: T) {
		super();
	}

	styled(styles: Partial<CSSStyleDeclaration>) {
		Object.assign(this.element.style, styles);

		return this;
	}
}
