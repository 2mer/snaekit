import type { GenericPoint } from "@sgty/point";
import { Component, type Entity } from "@snaekit/ecs";
import { Moving } from "./Moving";
import type { Movement } from "../system/Movement";

export class Snake<T extends GenericPoint<T>> extends Component {
	parts: Array<Entity> = [];

	onAdded(): void {
		// add the head of the snake on init
		this.grow(this.entity);
	}

	grow(entity: Entity) {
		this.parts.push(entity);
	}

	getTailEntity() {
		return this.parts[this.parts.length - 1];
	}

	private shiftEntityDirection(entity: Entity, newDirection: T) {
		const moving = entity.$(Moving<T>);
		const prevDirection = moving.direction.clone();

		moving.direction.set(newDirection);

		return prevDirection;
	}

	propagateMotion(movementSystem: Movement<T>, direction: T) {
		const collisions = movementSystem.getEntityCollisions(
			this.entity,
			direction,
		);
		const canMove = movementSystem.canEntityMove(this.entity, collisions);

		this.setMovingEnabled(canMove);

		if (!canMove) {
			movementSystem.handleEntityCollisions(this.entity, direction, collisions);
			return;
		}

		let prevDirection = direction;
		for (let i = 0; i < this.parts.length; i++) {
			const part = this.parts[i];

			prevDirection = this.shiftEntityDirection(part, prevDirection);
		}
	}

	setMovingEnabled(enabled: boolean) {
		for (let i = 0; i < this.parts.length; i++) {
			const part = this.parts[i];
			const moving = part.$(Moving);

			moving.enabled = enabled;
		}
	}
}
