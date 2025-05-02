import type { ECS } from "@snaekit/ecs";
import { createSimpleController } from "./createSimpleController";
import { Collision, Movement, Slither } from "@snaekit/core";
import { createWalledWorld } from "../world/createWalledWorld";
import { createLoopedWorld } from "../world/createLoopedWorld";
import { DomRenderer } from "@snaekit/render-dom";
import { useUpdateLoop } from "./useUpdateLoop";

export function createSimpleSetup({
	root,
	ecs,
	worldSize = 10,
	cellSize = 50,
	looped = false,
	turnBased = false,
}: {
	root: HTMLElement;
	ecs: ECS;
	worldSize?: number;
	cellSize?: number;
	looped?: boolean;
	turnBased?: boolean;
}) {
	root.style.setProperty("--cell-size", `${cellSize}px`);
	root.style.setProperty("--world-size", String(worldSize));
	root.classList.add("world");

	const controller = ecs.addSystem(
		createSimpleController(
			turnBased
				? {
						turnBased: true,
						update: () => {
							ecs.update();
						},
					}
				: {},
		),
	);
	const slither = ecs.addSystem(new Slither());
	const collision = ecs.addSystem(new Collision());
	const movement = ecs.addSystem(new Movement());
	const world = ecs.addSystem(
		looped
			? createLoopedWorld({ ecs, worldSize })
			: createWalledWorld({
					ecs,
					worldSize,
				}),
	);
	const renderer = ecs.addSystem(new DomRenderer(root));

	if (!turnBased) {
		useUpdateLoop(ecs);
	}

	return {
		controller,
		slither,
		movement,
		world,
		renderer,
		worldSize,
		cellSize,
		collision,
	};
}
