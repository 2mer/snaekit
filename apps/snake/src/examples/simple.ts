import { Example } from "../util/Example";
import { createApple } from "./impl/foods/apple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import { createSimpleSetup } from "./impl/game/createSimpleSetup";

export default Example(({ root, ecs, onGameOver }) => {
	const { renderer, world, worldSize } = createSimpleSetup({
		ecs,
		root,
	});

	const player = createSimpleSnake({
		ecs,
		color: "red",
		onHarm: onGameOver,
		layer: renderer.createLayer(),
	});

	const apple = createApple({ ecs, world, worldSize });
});
