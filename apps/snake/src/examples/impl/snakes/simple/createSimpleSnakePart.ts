import { type Point2D, vec2 } from "@sgty/point";
import { Moving, Collider, Snake } from "@snaekit/core";
import type { ECS } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { tryHarmEntity } from "../../game/tryHarmEntity";

export function createSimpleSnakePart(ecs: ECS, position?: Point2D) {
	const part = ecs.addEntity(
		new Position2D(position ?? vec2()),
		new DomRenderable()
			.cls("tile")
			.styled({ backgroundColor: "orange", zIndex: "10" }),
		new Moving(vec2()),
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
