import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Moving } from "../component/Moving";
import { Position } from "../component/Position";
import type { World } from "./World";
import { Collider } from "../component/Collider";
import type { GenericPoint } from "@sgty/point";

export class Movement<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Moving, Position]);

	constructor(public world: World<T>) {
		super();
	}

	public getEntityDirection(entity: Entity) {
		const moving$ = entity.$(Moving<T>);

		return moving$.direction;
	}

	public getEntityCollisions(
		entity: Entity,
		direction: T = this.getEntityDirection(entity),
	) {
		const position$ = entity.$(Position<T>);

		const wishPos = position$.position.clone().add(direction);

		const entitiesAhead = this.world.worldMap.get(wishPos) ?? new Set();

		return Array.from(entitiesAhead.values())
			.filter((e) => e.components.has(Collider))
			.map((e) => e.$(Collider));
	}

	public canEntityMove(
		entity: Entity,
		collisions = this.getEntityCollisions(entity),
	) {
		return collisions.every((collider) => !collider.options.isSolid(entity));
	}

	public handleEntityCollisions(
		entity: Entity,
		direction: T,
		collisions: Collider<T>[],
	) {
		collisions.forEach((collider) => {
			collider.options.onCollide?.(entity, direction);
		});
	}

	update() {
		const entities = this.ecs.getSystemEntities(this)!;

		for (const entity of entities) {
			const moving$ = entity.$(Moving<T>);
			const position$ = entity.$(Position<T>);

			if (!moving$.enabled) {
				continue;
			}

			const collisions = this.getEntityCollisions(entity, moving$.direction);
			const canMove = this.canEntityMove(entity, collisions);

			this.handleEntityCollisions(entity, moving$.direction, collisions);

			if (!canMove) {
				moving$.onMoveStopped?.();
				continue;
			}

			if (moving$.sleep) {
				moving$.sleep--;
				continue;
			}

			const wishPos = position$.position.clone().add(moving$.direction);

			// update the matrix
			this.world.updateEntity(entity, () => {
				position$.position.set(wishPos);
			});
		}
	}
}
