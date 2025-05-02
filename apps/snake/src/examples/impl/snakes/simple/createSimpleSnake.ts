import { type Point2D, vec2 } from "@sgty/point";
import {
	Moving,
	WishDir,
	Snake,
	Controlled,
	Collider,
	Gut,
} from "@snaekit/core";
import type { ECS, Entity } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { ignoreBackwardDirection } from "../../game/createSimpleController";
import { Sensitive } from "../../component/Sensitive";
import { tryHarmEntity } from "../../game/tryHarmEntity";
import { createSimpleSnakePartDom } from "./createSimpleSnakePartDom";

export function createSimpleSnake({
	ecs,
	color,
	onHarm,
	layer,
}: {
	ecs: ECS;
	color: string;
	onHarm: (source: Entity) => void;
	layer: HTMLElement;
}) {
	const player = ecs.addEntity(
		new Position2D(vec2(0, 0)),
		new DomRenderable(createSimpleSnakePartDom())
			.cls("tile", "head")
			.styled({ "--bg-color": color })
			.layer(layer),
		new Moving(vec2()),
		new WishDir(vec2()),
		new Snake(),
		new Sensitive(onHarm),
		new Controlled<Point2D>((input) => {
			const moving = player.$(Moving<Point2D>);
			return ignoreBackwardDirection(input, moving.direction);
		}),
		new Collider({
			onCollide(entity) {
				tryHarmEntity({ target: entity, attacker: player });
			},
			isSolid(entity) {
				return entity.components.has(Snake);
			},
		}),
		new Gut(),
	);

	player.name = "Player";

	return player;
}
