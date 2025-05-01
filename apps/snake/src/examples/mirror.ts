import { Controlled, Snake } from "@snaekit/core";
import { DomRenderer, Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import simple from "./simple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import type { Point2D } from "@sgty/point";

export default Example((ctx) => {
	simple(ctx);

	const { ecs, onGameOver } = ctx;

	const [player] = ecs.query(Snake);
	const renderer = ecs.getSystem(DomRenderer)!;

	player.$(Position2D).position.set(3, 3);
	player.$(Position2D).onChanged();

	const playerMirror = createSimpleSnake({
		ecs,
		color: "blue",
		onHarm: onGameOver,
		layer: renderer.createLayer(),
	});
	playerMirror.$(Controlled<Point2D>).getWishDir = (dir) => dir.clone().mul(-1);

	playerMirror.$(Position2D).position.set(6, 6);
	playerMirror.$(Position2D).onChanged();
});
