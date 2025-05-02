import { Collider, Collision, Gut, type World } from "@snaekit/core";
import type { ECS } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { randomFreePosition } from "../game/randomFreePosition";
import { False } from "../util/Boolean";
import type { Point2D } from "@sgty/point";

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
				if (entity.components.has(Gut)) {
					ecs.getSystem(Collision)!.effects.once(() => {
						const gut = entity.$(Gut);

						gut.onEat(entity);

						const myPos = apple.$(Position2D);
						myPos.position.set(randomFreePosition(world, 0, worldSize));
						myPos.onChanged();
					});
				}
			},
			isSolid: False,
		}),
	);

	apple.name = "Apple";

	return apple;
}
