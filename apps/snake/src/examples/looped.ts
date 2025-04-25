import { vec2 } from "@sgty/point";
import {
	Controlled,
	Movement,
	Moving,
	Slither,
	Snake,
	WishDir,
} from "@snaekit/core";
import { DomRenderable, DomRenderer, Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import { createLoopedWorld } from "./impl/world/createLoopedWorld";
import { createApple } from "./impl/foods/apple";
import { createSimpleController } from "./impl/game/createSimpleController";

export default Example((root, ecs) => {
	const CELL_SIZE = 50;
	const WORLD_SIZE = 10;

	root.style.setProperty("--cell-size", `${CELL_SIZE}px`);
	root.style.setProperty("--world-size", String(WORLD_SIZE));
	root.classList.add("world");

	const world = createLoopedWorld({
		ecs,
		worldSize: WORLD_SIZE,
	});

	const renderer = new DomRenderer(root);
	const movement = new Movement(world);
	const controller = createSimpleController({});
	const slither = new Slither();

	ecs.addSystem(world);
	ecs.addSystem(controller);
	ecs.addSystem(slither);
	ecs.addSystem(movement);
	ecs.addSystem(renderer);

	function update() {
		ecs.update(() => {
			controller.update();
			slither.update();
			movement.update();
			world.update();
			renderer.update();
		});
	}

	const player = ecs.addEntity(
		new Position2D(vec2(0, 0)),
		new DomRenderable()
			.cls("tile")
			.styled({ backgroundColor: "red", zIndex: "10" }),
		new Moving(vec2()),
		new WishDir(vec2()),
		new Snake(),
		new Controlled(),
	);

	const apple = createApple({ ecs, world, worldSize: WORLD_SIZE });

	world.update();
	renderer.update();

	const loopInterval = setInterval(() => {
		update();
	}, 250);

	ecs.events.on("destroy", () => {
		clearInterval(loopInterval);
	});
});
