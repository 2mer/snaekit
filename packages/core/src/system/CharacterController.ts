import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Snake } from "../component/Snake";
import type { GenericPoint } from "@sgty/point";
import type { Movement } from "./Movement";

export class CharacterController<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Snake<T>]);
	character: Entity | undefined = undefined;

	constructor(public movement: Movement<T>) {
		super();
	}

	onEntityAdded(entity: Entity): void {
		this.character = entity;
	}

	onEntityRemoved(_: Entity): void {
		this.character = undefined;
	}

	setMoveDirection(direction: T) {
		const snake = this.character!.$(Snake<T>);

		snake.propagateMotion(this.movement, direction);
	}
}
