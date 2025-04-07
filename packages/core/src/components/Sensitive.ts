import { Component } from "@snaekit/ecs";

export class Sensitive extends Component {
	constructor(public onDamage: () => {}) {
		super();
	}
}
