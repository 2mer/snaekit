import { Collider, Snake, type World } from "@snaekit/core";
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
			.styled({ backgroundColor: "green", zIndex: "10" }),
		new Collider({
			onCollide(entity) {
				if (entity.components.has(Snake)) {
					const snake = entity.$(Snake);
					const tail = snake.getTailEntity();
					const tailPosition = tail.$(Position2D).position;

					snake.grow(createSimpleSnakePart(ecs, tailPosition.clone()));

					const myPos = apple.$(Position2D);
					myPos.position.set(randomFreePosition(world, 0, worldSize));
					myPos.onChanged();
				}
			},
			isSolid: False,
		}),
	);

	return apple;
}
