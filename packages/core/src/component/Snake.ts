import type { GenericPoint } from "@sgty/point";
import { Component, type Entity } from "@snaekit/ecs";
import { Moving } from "./Moving";
import type { Collision } from "../system/Collision";

class Node extends Component {
	/**
	 * will eventually reach the head
	 */
	prev?: Node;
	/**
	 * will eventually reach the tail
	 */
	next?: Node;
}

export class Snake<T extends GenericPoint<T>> extends Component {
	parts: Array<Entity> = [];

	static Tail = class Tail extends Component {};
	static Head = class Head extends Component {};
	static Node = Node;

	onAdded(): void {
		// add the head of the snake on init
		this.entity.components.add(new Snake.Head());
		this.grow(this.entity);
	}

	grow(entity: Entity) {
		const newNode = new Snake.Node();
		entity.components.add(new Snake.Tail(), newNode);

		if (this.parts.length) {
			const tail = this.getTailEntity();
			tail.components.delete(Snake.Tail);
			const node = tail.$(Snake.Node);

			node.next = newNode;
			newNode.prev = node;

			node.onChanged();
		}

		this.parts.push(entity);
	}

	getTailEntity() {
		return this.parts[this.parts.length - 1];
	}

	private shiftEntityDirection(entity: Entity, newDirection: T) {
		const moving = entity.$(Moving<T>);
		const prevDirection = moving.direction.clone();

		moving.direction.set(newDirection);
		moving.onChanged();

		return prevDirection;
	}

	propagateMotion(collisionSystem: Collision<T>, direction: T) {
		const collisions = collisionSystem.getEntityCollisions(
			this.entity,
			direction,
		);
		const canMove = collisionSystem.canEntityMove(
			this.entity,
			direction,
			collisions,
		);

		this.setMovingEnabled(canMove);

		if (!canMove) {
			// collisionSystem.handleEntityCollisions(this.entity, direction, collisions);
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
