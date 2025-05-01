import { type Point2D, vec2 } from "@sgty/point";
import { Moving, WishDir, Snake, Controlled } from "@snaekit/core";
import type { ECS, Entity } from "@snaekit/ecs";
import { Position2D, DomRenderable } from "@snaekit/render-dom";
import { ignoreBackwardDirection } from "../../game/createSimpleController";
import { Sensitive } from "../../component/Sensitive";

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
		new DomRenderable()
			.cls("tile", "head")
			.styled({ backgroundColor: color, zIndex: "10" })
			.layer(layer),
		new Moving(vec2()),
		new WishDir(vec2()),
		new Snake(),
		new Sensitive(onHarm),
		new Controlled<Point2D>((input) => {
			const moving = player.$(Moving<Point2D>);
			return ignoreBackwardDirection(input, moving.direction);
		}),
	);

	return player;
}
