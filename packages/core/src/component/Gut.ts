import { Component, type Entity } from "@snaekit/ecs";

export class Gut extends Component {
	public constructor(public onEat: (entity: Entity) => void = () => {}) {
		super();
	}
}
