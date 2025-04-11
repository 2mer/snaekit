import { useEffect, useRef } from "react";
import { Direction, Matrix, Tile } from "@snaekit/core";
import "./App.css";
import { type Component, ECS } from "@snaekit/ecs";
import { vec2, type Point2D } from "@sgty/point";
import { Position } from "./ecs/component/Position";
import { DomRenderable } from "./ecs/component/DomRenderable";
import { World } from "./ecs/system/World";
import { DomRenderer } from "./ecs/system/DomRenderer";
import { CharacterController } from "./ecs/system/CharacterController";
import { Movement } from "./ecs/system/Movement";
import { Snake } from "./ecs/component/Snake";
import { Moving } from "./ecs/component/Moving";
import { Collider } from "./ecs/component/Collider";

function App() {
	const gameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const CELL_SIZE = 50;
		const WORLD_SIZE = 10;

		const gameEl = gameRef.current!;
		gameEl.style.setProperty("--cell-size", `${CELL_SIZE}px`);
		gameEl.style.setProperty("--world-size", String(WORLD_SIZE));

		const ecs = new ECS();
		const world = new World(new Matrix(WORLD_SIZE, WORLD_SIZE));
		const renderer = new DomRenderer(gameEl);
		const movement = new Movement(world);
		const controller = new CharacterController();

		ecs.addSystem(world);
		ecs.addSystem(renderer);
		ecs.addSystem(movement);
		ecs.addSystem(controller);

		function createTile(position: Point2D, ...components: Component[]) {
			const entity = ecs.addEntity();

			const el = document.createElement("div");
			el.classList.add("tile");

			el.style.setProperty("background-color", "red");

			entity.components.add(
				new Position(position),
				new Tile(),
				new DomRenderable(el),
				...components,
			);

			return entity;
		}

		function update() {
			movement.update();
			renderer.update();

			ecs.destoryPendingEntities();
		}

		const keyHandlers = {
			a: () => {
				controller.setMoveDirection(Direction.LEFT);
				update();
			},
			s: () => {
				controller.setMoveDirection(Direction.DOWN);
				update();
			},
			d: () => {
				controller.setMoveDirection(Direction.RIGHT);
				update();
			},
			w: () => {
				controller.setMoveDirection(Direction.UP);
				update();
			},
		} as Record<string, () => void>;

		const player = createTile(vec2(0, 0), new Moving(), new Snake());

		createTile(vec2(5, 5), new Collider(() => true))

		// player.$(Position).position.add(1,1);
		// player.$(Position).update(pos => {
		// 	pos.add(1,1)
		// });

		document.addEventListener("keydown", (e) => {
			const handler = keyHandlers[e.key];

			handler?.();
		});
	}, []);

	return (
		<>
			<div className="world" ref={gameRef} />
		</>
	);
}

export default App;
