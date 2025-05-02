import {
	type ComponentClass,
	Effects,
	type Entity,
	System,
} from "@snaekit/ecs";
import { Moving } from "../component/Moving";
import { Collider } from "../component/Collider";
import type { GenericPoint } from "@sgty/point";
import { Position } from "../component/Position";
import { World } from "./World";

export class Collision<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([
		Moving<T>,
		Collider<T>,
		Position<T>,
	]);

	effects = new Effects<number>();

	public world!: World<T>;

	init(): void {
		this.world = this.ecs.getSystem(World<T>)!;
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

	public handleEntityCollisions(
		entity: Entity,
		direction: T,
		collisions: Collider<T>[],
	) {
		collisions.forEach((collider) => {
			collider.options.onCollide?.(entity, direction);
		});
	}

	public canEntityMove(
		entity: Entity,
		direction: T,
		collisions: Collider<T>[],
	) {
		return collisions.every(
			(collider) => !collider.options.isSolid(entity, direction),
		);
	}

	update(delta: number) {
		for (const entity of this.entities) {
			const moving$ = entity.$(Moving<T>);

			// if (!moving$.enabled) {
			// 	continue;
			// }

			const collisions = this.getEntityCollisions(entity, moving$.direction);
			const canMove = this.canEntityMove(entity, moving$.direction, collisions);

			if (moving$.enabled && !moving$.sleep) {
				this.handleEntityCollisions(entity, moving$.direction, collisions);
			}

			if (!canMove && !moving$.sleep) {
				moving$.sleep = 1;
			}
		}

		this.effects.run(delta);
	}
}
