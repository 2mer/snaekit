import { Growing, Movement, Slither } from "@snaekit/core";
import { DomRenderer } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import { createWalledWorld } from "./impl/world/createWalledWorld";
import { createSimpleController } from "./impl/game/createSimpleController";
import { createApple } from "./impl/foods/apple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import { type Point2D, vec2 } from "@sgty/point";
import { Direction } from "../util/Direction";

export default Example(({ root, ecs, onGameOver }) => {
	const CELL_SIZE = 50;
	const WORLD_SIZE = 10;

	root.style.setProperty("--cell-size", `${CELL_SIZE}px`);
	root.style.setProperty("--world-size", String(WORLD_SIZE));
	root.classList.add("world");

	const controller = ecs.addSystem(
		createSimpleController({
			turnBased: true,
			update: () => {
				ecs.update();
			},
		}),
	);
	const slither = ecs.addSystem(new Slither());
	const movement = ecs.addSystem(new Movement());
	const growing = ecs.addSystem(new Growing());
	const world = ecs.addSystem(
		createWalledWorld({
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

	function bigDeg(deg: number) {
		if (deg < 0) return 360 + deg;
		return deg;
	}

	function test(currentDir: Point2D, nextDir: Point2D, expected: string) {
		const delta = nextDir.angleDeg() - currentDir.angleDeg();

		return console.log(
			`${nextDir.angleDeg()} - ${currentDir.angleDeg()} = ${delta}  |  ${delta > 0 ? "right" : "left"}  e:${expected}`,
		);
	}

	test(Direction.UP, Direction.LEFT, "LEFT");
	test(Direction.UP, Direction.RIGHT, "RIGHT");
});
