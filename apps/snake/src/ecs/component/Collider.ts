import type { Point2D } from "@sgty/point";
import { Component, type Entity } from "@snaekit/ecs";

export class Collider extends Component {
	/**
	 * @param onCollide code that will execute when colliding with a collider (before moving into it), returns whether the collider is solid
	 */
	constructor(
		public options: {
			onCollide?: (entity: Entity, direction: Point2D) => void;
			isSolid: (entity: Entity) => boolean;
		},
	) {
		super();
	}
}
