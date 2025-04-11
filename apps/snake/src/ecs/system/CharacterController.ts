import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Snake } from "../component/Snake";
import { Moving } from "../component/Moving";
import type { Point2D } from "@sgty/point";

export class CharacterController extends System {
	componentsRequired: Set<ComponentClass> = new Set([Snake, Moving]);
	character: Entity | undefined = undefined;

	onEntityAdded(entity: Entity): void {
		this.character = entity;
	}

	onEntityRemoved(_: Entity): void {
		this.character = undefined;
	}

	setMoveDirection(direction: Point2D) {
		const moving = this.character!.$(Moving);
		moving.direction = direction;
	}
}
