import { Snake } from "@snaekit/core";
import { Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import simple from "./simple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";

export default Example((ctx) => {
	simple(ctx);

	const { ecs, onGameOver } = ctx;

	const [player] = ecs.query(Snake);

	player.$(Position2D).position.set(3, 3);
	player.$(Position2D).onChanged();

	const playerMirror = createSimpleSnake({
		ecs,
		color: "blue",
		onHarm: onGameOver,
	});

	playerMirror.$(Position2D).position.set(6, 6);
	playerMirror.$(Position2D).onChanged();
});
