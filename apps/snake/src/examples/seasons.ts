import { Controlled, Moving, Snake } from "@snaekit/core";
import { DomRenderer, Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import simple from "./simple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import { vec2, type Point2D } from "@sgty/point";
import { ignoreBackwardDirection } from "./impl/game/createSimpleController";
import { linkGuts } from "./impl/game/linkGuts";

export default Example((ctx) => {
	simple(ctx);

	const { ecs, onGameOver } = ctx;

	const [player] = ecs.query(Snake);
	const renderer = ecs.getSystem(DomRenderer)!;

	player.$(Position2D).position.set(0, 0);
	player.$(Position2D).onChanged();

	const entries = [
		{ pos: vec2(0, 5) },
		{ pos: vec2(5, 5) },
		{ pos: vec2(5, 0) },
	];

	const seasons = entries.map((entry, index) => {
		const seasonLayer = renderer.createLayer();
		seasonLayer.style.setProperty(
			"filter",
			`hue-rotate(${(index + 1) * 90}deg)`,
		);

		const seasonPlayer = createSimpleSnake({
			ecs,
			color: "red",
			onHarm: onGameOver,
			layer: seasonLayer,
		});
		seasonPlayer.name = "Negative";
		seasonPlayer.$(Controlled<Point2D>).getWishDir = (dir) => {
			const moving = seasonPlayer.$(Moving<Point2D>);
			// const newDir = dir.clone().rotateDeg(90);
			const newDir = dir.clone();
			return ignoreBackwardDirection(newDir, moving.direction);
		};

		seasonPlayer.$(Position2D).position.set(entry.pos);
		seasonPlayer.$(Position2D).onChanged();

		return seasonPlayer;
	});

	linkGuts([player, ...seasons]);
});
