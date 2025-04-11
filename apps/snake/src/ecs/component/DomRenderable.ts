import { Component } from "@snaekit/ecs";

export class DomRenderable<T extends HTMLElement> extends Component {
	constructor(public readonly element: T) {
		super();
	}
}
