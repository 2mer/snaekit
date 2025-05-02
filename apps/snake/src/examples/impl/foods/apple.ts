import { Collider, Edible, Snake, type World } from "@snaekit/core";
import type { ECS } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { randomFreePosition } from "../game/randomFreePosition";
import { False } from "../util/Boolean";
import type { Point2D } from "@sgty/point";
import { createSimpleSnakePart } from "../snakes/simple/createSimpleSnakePart";

export function createApple({
	ecs,
	world,
	worldSize,
}: { ecs: ECS; world: World<Point2D>; worldSize: number }) {
	const apple = ecs.addEntity(
		new Position2D(randomFreePosition(world, 0, worldSize)),
		new DomRenderable()
			.cls("tile", "apple")
			.styled({ "--bg-color": "green", zIndex: "10" }),
		new Collider({
			onCollide(entity) {
				apple.$(Edible).tryFeed(entity);
			},
			isSolid: False,
		}),
		new Edible((diner) => {
			if (diner.components.has(Snake)) {
				const snake = diner.$(Snake);

				snake.grow(createSimpleSnakePart(ecs, diner));

				const myPos = apple.$(Position2D);
				myPos.position.set(randomFreePosition(world, 0, worldSize));
				myPos.onChanged();
			}
		}),
	);

	apple.name = "Apple";

	return apple;
}
