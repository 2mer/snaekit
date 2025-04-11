import { Component, type Entity } from "@snaekit/ecs";

export class Collider extends Component {
	/**
	 * @param onCollide code that will execute when colliding with a collider (before moving into it), returns whether the collider is solid
	 */
	constructor(public onCollide: (entity: Entity) => boolean) {
		super();
	}
}
