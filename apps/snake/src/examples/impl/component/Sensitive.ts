import { Component, type Entity } from "@snaekit/ecs";

export class Sensitive extends Component {
	constructor(public onHarm: (source: Entity) => void) {
		super();
	}
}
