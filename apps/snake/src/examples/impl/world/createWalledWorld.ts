import type { Point2D } from "@sgty/point";
import { Collider, World } from "@snaekit/core";
import type { ECS } from "@snaekit/ecs";
import { OOBFallbackMatrix } from "./OOBFallbackMatrix";

export function createWalledWorld({
	worldSize,
	ecs,
}: { worldSize: number; ecs: ECS }) {
	const OOB_TILE = ecs.addEntity();
	OOB_TILE.components.add(
		new Collider<Point2D>({
			isSolid() {
				return true;
			},
		}),
	);

	const world = new World(
		new OOBFallbackMatrix(worldSize, worldSize, new Set([OOB_TILE])),
	);

	return world;
}
