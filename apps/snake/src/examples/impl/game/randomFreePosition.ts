import { Point2D } from "@sgty/point";
import type { World } from "@snaekit/core";
import { lerp } from "../util/lerp";

export function randomFreePosition(
	world: World<Point2D>,
	min: number,
	max: number,
) {
	const pos = new Point2D(
		lerp(min, max, Math.random()),
		lerp(min, max, Math.random()),
	).round();

	const items = world.worldMap.get(pos);
	// roll again
	if (!items?.size) return pos;

	// roll again
	return randomFreePosition(world, min, max);
}
