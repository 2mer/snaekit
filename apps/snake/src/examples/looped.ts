import { Growing, Movement, Slither } from "@snaekit/core";
import { DomRenderer } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import { createLoopedWorld } from "./impl/world/createLoopedWorld";
import { createApple } from "./impl/foods/apple";
import { createSimpleController } from "./impl/game/createSimpleController";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import { useUpdateLoop } from "./impl/game/useUpdateLoop";

export default Example(({ root, ecs, onGameOver }) => {
	const CELL_SIZE = 50;
	const WORLD_SIZE = 10;

	root.style.setProperty("--cell-size", `${CELL_SIZE}px`);
	root.style.setProperty("--world-size", String(WORLD_SIZE));
	root.classList.add("world");

	const controller = ecs.addSystem(createSimpleController({}));
	const slither = ecs.addSystem(new Slither());
	const movement = ecs.addSystem(new Movement());
	const growing = ecs.addSystem(new Growing());
	const world = ecs.addSystem(
		createLoopedWorld({
			ecs,
			worldSize: WORLD_SIZE,
		}),
	);
	const renderer = ecs.addSystem(new DomRenderer(root));

	const player = createSimpleSnake({
		ecs,
		color: "red",
		onHarm: onGameOver,
		layer: renderer.createLayer(),
	});

	const apple = createApple({ ecs, world, worldSize: WORLD_SIZE });

	useUpdateLoop(ecs);

	console.log({ player });
});
