import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Snake } from "../component/Snake";
import type { Point2D } from "@sgty/point";
import type { Movement } from "./Movement";

export class CharacterController extends System {
	componentsRequired: Set<ComponentClass> = new Set([Snake]);
	character: Entity | undefined = undefined;

	constructor(public movement: Movement) {
		super();
	}

	onEntityAdded(entity: Entity): void {
		this.character = entity;
	}

	onEntityRemoved(_: Entity): void {
		this.character = undefined;
	}

	setMoveDirection(direction: Point2D) {
		const snake = this.character!.$(Snake);

		snake.propagateMotion(this.movement, direction);
	}
}
