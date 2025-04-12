import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Moving } from "../component/Moving";
import { Position } from "../component/Position";
import type { World } from "./World";
import { Collider } from "../component/Collider";
import type { Point2D } from "@sgty/point";
import { Position2D } from "../component/util/Position2D";

export class Movement extends System {
	componentsRequired: Set<ComponentClass> = new Set([Moving, Position]);

	constructor(public world: World<Point2D>) {
		super();
	}

	public getEntityDirection(entity: Entity) {
		const moving$ = entity.$(Moving);

		return moving$.direction;
	}

	public getEntityCollisions(
		entity: Entity,
		direction: Point2D = this.getEntityDirection(entity),
	) {
		const position$ = entity.$(Position2D);

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
		direction: Point2D,
		collisions: Collider[],
	) {
		collisions.forEach((collider) => {
			collider.options.onCollide?.(entity, direction);
		});
	}

	update() {
		const entities = this.ecs.getSystemEntities(this)!;

		for (const entity of entities) {
			const moving$ = entity.$(Moving);
			const position$ = entity.$(Position2D);

			if (!moving$.enabled) {
				continue;
			}

			let wishPos = position$.position.clone().add(moving$.direction);

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

			wishPos = position$.position.clone().add(moving$.direction);

			// update the matrix
			this.world.updateEntity(entity, () => {
				position$.position.set(wishPos);
			});
		}
	}
}
