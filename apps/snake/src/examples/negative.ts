import { Controlled, Moving, Snake } from "@snaekit/core";
import { DomRenderer, Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import simple from "./simple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import type { Point2D } from "@sgty/point";
import { ignoreBackwardDirection } from "./impl/game/createSimpleController";
import { linkGuts } from "./impl/game/linkGuts";

export default Example((ctx) => {
	simple(ctx);

	const { ecs, onGameOver } = ctx;

	const [player] = ecs.query(Snake);
	const renderer = ecs.getSystem(DomRenderer)!;

	player.$(Position2D).position.set(3, 3);
	player.$(Position2D).onChanged();

	const negativeLayer = renderer.createLayer();
	negativeLayer.classList.add("negative");

	const negativePlayer = createSimpleSnake({
		ecs,
		color: "red",
		onHarm: onGameOver,
		layer: negativeLayer,
	});
	negativePlayer.name = "Negative";
	negativePlayer.$(Controlled<Point2D>).getWishDir = (dir) => {
		const moving = negativePlayer.$(Moving<Point2D>);
		const newDir = dir.clone().mul(-1);
		return ignoreBackwardDirection(newDir, moving.direction);
	};

	linkGuts([player, negativePlayer]);

	negativePlayer.$(Position2D).position.set(6, 6);
	negativePlayer.$(Position2D).onChanged();
});
