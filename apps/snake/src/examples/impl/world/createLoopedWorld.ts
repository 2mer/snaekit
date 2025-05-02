import type { Point2D } from "@sgty/point";
import { Collider, Movement, Moving, World } from "@snaekit/core";
import type { ECS } from "@snaekit/ecs";
import { Position2D } from "@snaekit/render-dom";
import { OOBFallbackMatrix } from "./OOBFallbackMatrix";

export function createLoopedWorld({
	worldSize,
	ecs,
}: { worldSize: number; ecs: ECS }) {
	function getOverflowPosition(position: Point2D, direction: Point2D) {
		return position
			.clone()
			.add(direction)
			.map((v) => {
				if (v >= worldSize) return v % worldSize;
				if (v < 0) return (worldSize + v) % worldSize;

				return v;
			});
	}

	const OOB_TILE = ecs.addEntity();
	OOB_TILE.components.add(
		new Collider<Point2D>({
			isSolid: (entity, direction) => {
				const position$ = entity.$(Position2D);

				const newPos = getOverflowPosition(position$.position, direction);

				return Array.from(world.getEntitiesAt(newPos) ?? []).some((e) => {
					const collider = e.$(Collider);
					return collider?.options.isSolid(entity, direction);
				});
			},
			onCollide(entity, direction) {
				const position$ = entity.$(Position2D);
				const moving$ = entity.$(Moving);

				const newPos = getOverflowPosition(position$.position, direction);

				const ents = Array.from(world.getEntitiesAt(newPos) ?? []);
				ents.forEach((e) => {
					const collider = e.$(Collider);
					collider?.options?.onCollide?.(entity, direction);
				});

				const canTp = ents.every((e) => {
					const collider = e.$(Collider);
					return !collider?.options?.isSolid?.(entity, direction);
				});
				if (canTp) {
					moving$.sleep = 1;

					ecs.getSystem(Movement)!.effects.once(() => {
						position$.position.set(newPos);
						position$.onChanged();
					});
				}
			},
		}),
	);

	const world = new World(
		new OOBFallbackMatrix(worldSize, worldSize, new Set([OOB_TILE])),
	);

	return world;
}
