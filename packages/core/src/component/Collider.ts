import type { GenericPoint } from "@sgty/point";
import { Component, type Entity } from "@snaekit/ecs";

export class Collider<T extends GenericPoint<T>> extends Component {
	/**
	 * @param onCollide code that will execute when colliding with a collider (before moving into it), returns whether the collider is solid
	 */
	constructor(
		public options: {
			onCollide?: (entity: Entity, direction: T) => void;
			isSolid: (entity: Entity) => boolean;
		},
	) {
		super();
	}
}
