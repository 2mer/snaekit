import { Example } from "../util/Example";
import { createApple } from "./impl/foods/apple";
import { createSimpleSnake } from "./impl/snakes/simple/createSimpleSnake";
import { createSimpleSetup } from "./impl/game/createSimpleSetup";
import { Collider } from "@snaekit/core";
import { vec2 } from "@sgty/point";
import { Position2D } from "@snaekit/render-dom";

export default Example(({ root, ecs, onGameOver }) => {
	const { renderer, world, worldSize } = createSimpleSetup({
		ecs,
		root,
		worldSize: 3,
		turnBased: true,
		looped: true,
	});

	const player = createSimpleSnake({
		ecs,
		color: "red",
		onHarm: onGameOver,
		layer: renderer.createLayer(),
	});

	const apple = createApple({ ecs, world, worldSize });
	const applePos = apple.$(Position2D);
	applePos.position.set(0, 2);
	applePos.onChanged();

	function grow() {
		apple.$(Collider)!.options.onCollide!(player, vec2());
	}

	function render() {
		renderer.update(0);
	}

	function handleKeys(e: KeyboardEvent) {
		if (e.key === " ") {
			grow();
			e.preventDefault();
			return;
		}
		if (e.key === "r" && !e.ctrlKey) {
			render();
			e.preventDefault();
		}
	}

	document.addEventListener("keydown", handleKeys);

	window.$debug = {
		player,
		apple,
		grow,
		render,
	};

	ecs.events.once("destroy", () => {
		window.$debug = undefined;
		document.removeEventListener("keydown", handleKeys);
	});
});
