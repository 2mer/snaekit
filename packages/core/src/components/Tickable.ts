import { Component } from "@snaekit/ecs";

export class Tickable extends Component {
	constructor(public onTick: () => {}) {
		super();
	}
}
