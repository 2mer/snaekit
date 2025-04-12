import { Component } from "@snaekit/ecs";

export class Position<T = any> extends Component {
	constructor(public position: T) {
		super();
	}
}
