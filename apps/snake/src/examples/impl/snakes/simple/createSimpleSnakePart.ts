import type { Point2D } from "@sgty/point";
import { Moving, Collider, Snake } from "@snaekit/core";
import type { ECS, Entity } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { tryHarmEntity } from "../../game/tryHarmEntity";
import { createSimpleSnakePartDom } from "./createSimpleSnakePartDom";

export function createSimpleSnakePart(ecs: ECS, entity: Entity) {
	const snake = entity.$(Snake);
	const tail = snake.getTailEntity();
	const tailPosition = tail.$(Position2D).position;
	const tailDirection = tail.$(Moving<Point2D>).direction;
	const renderable = entity.$(DomRenderable);

	const part = ecs.addEntity(
		new Position2D(tailPosition.clone()),
		new DomRenderable(createSimpleSnakePartDom())
			.cls("tile")
			.styled({ "--bg-color": "orange" })
			.layer(renderable._layer!),
		new Moving(tailDirection.clone()),
		new Collider({
			onCollide(entity) {
				tryHarmEntity({ target: entity, attacker: part });
			},
			isSolid(entity) {
				return entity.components.has(Snake);
			},
		}),
	);

	return part;
}
