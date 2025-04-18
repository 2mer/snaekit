import { useEffect, useRef } from "react";
// import { Direction, Matrix, Tile } from "@snaekit/core";
import "./App.css";
import { type Component, ECS, System } from "@snaekit/ecs";
import { type Point2D, vec2 } from "@sgty/point";
import {
	CharacterController,
	Collider,
	Controlled,
	Matrix,
	Movement,
	Moving,
	Position,
	Slither,
	Snake,
	WishDir,
	World,
} from "@snaekit/core";
import { DomRenderable, DomRenderer, Position2D } from "@snaekit/render-dom";
import { Direction } from "./util/Direction";
// import { Position } from "./ecs/component/Position";
// import { DomRenderable } from "./ecs/component/DomRenderable";
// import { World } from "./ecs/system/World";
// import { DomRenderer } from "./ecs/system/DomRenderer";
// import { CharacterController } from "./ecs/system/CharacterController";
// import { Movement } from "./ecs/system/Movement";
// import { Snake } from "./ecs/component/Snake";
// import { Moving } from "./ecs/component/Moving";
// import { Collider } from "./ecs/component/Collider";
// import { Position2D } from "./ecs/component/util/Position2D";

const True = () => true;
const False = () => false;

function App() {
	const gameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const CELL_SIZE = 50;
		const WORLD_SIZE = 10;

		const gameEl = gameRef.current!;
		gameEl.style.setProperty("--cell-size", `${CELL_SIZE}px`);
		gameEl.style.setProperty("--world-size", String(WORLD_SIZE));

		const ecs = new ECS();

		const OOB_TILE = ecs.addEntity();
		OOB_TILE.components.add(
			new Collider<Point2D>({
				isSolid: False,
				onCollide(entity, direction) {
					const position$ = entity.$(Position2D);
					const moving$ = entity.$(Moving);

					const newPos = position$.position
						.clone()
						.add(direction)
						.map((v) => {
							if (v >= WORLD_SIZE) return v % WORLD_SIZE;
							if (v < 0) return (WORLD_SIZE + v) % WORLD_SIZE;

							return v;
						});

					moving$.sleep = 1;

					position$.position.set(newPos);
					position$.onChanged();

				},
			}),
		);

		class OOBFallbackMatrix<T> extends Matrix<T> {
			constructor(
				width: number,
				height: number,
				public oobFallback: T,
			) {
				super(width, height);
			}

			get(position: Point2D): T {
				if (!this.has(position)) return this.oobFallback;

				return super.get(position);
			}
		}

		const world = new World(
			new OOBFallbackMatrix(WORLD_SIZE, WORLD_SIZE, new Set([OOB_TILE])),
		);
		const renderer = new DomRenderer(gameEl);
		const movement = new Movement(world);
		const controller = new CharacterController();
		const slither = new Slither();

		ecs.addSystem(world);
		ecs.addSystem(controller);
		ecs.addSystem(slither);
		ecs.addSystem(movement);
		ecs.addSystem(renderer);

		function createTile(
			position: Point2D,
			styles: Partial<CSSStyleDeclaration>,
			...components: Component[]
		) {
			const entity = ecs.addEntity();

			const el = document.createElement("div");
			el.classList.add("tile");

			entity.components.add(
				new Position(position),
				new DomRenderable(el).styled(styles),
				...components,
			);

			return entity;
		}

		function createSnakePart(position?: Point2D) {
			const part = ecs.addEntity(
				new Position2D(position ?? vec2()),
				new DomRenderable().cls("tile").styled({ backgroundColor: "orange", zIndex: "10" }),
				new Moving(vec2()),
				new Collider({
					onCollide(entity) {
						if (entity === player) {
							alert("game over!");
						}
					},
					isSolid(entity) {
						return entity === player;
					}
				})
			);

			return part;
		}

		function update() {
			ecs.update(() => {
				controller.update();
				slither.update();
				movement.update();
				world.update();
				renderer.update();
			})
		}

		function handleMoveInDirection(direction: Point2D) {
			return () => {
				controller.setMoveDirection(direction);
				update();
			}
		}

		const keyHandlers = {
			a: handleMoveInDirection(Direction.LEFT),
			s: handleMoveInDirection(Direction.DOWN),
			d: handleMoveInDirection(Direction.RIGHT),
			w: handleMoveInDirection(Direction.UP),

			ArrowLeft: handleMoveInDirection(Direction.LEFT),
			ArrowDown: handleMoveInDirection(Direction.DOWN),
			ArrowRight: handleMoveInDirection(Direction.RIGHT),
			ArrowUp: handleMoveInDirection(Direction.UP),
		} as Record<string, () => void>;

		const player = ecs.addEntity(
			new Position2D(vec2(0, 0)),
			new DomRenderable().cls("tile").styled({ backgroundColor: "red", zIndex: "10" }),
			new Moving(vec2()),
			new WishDir(vec2()),
			new Snake(),
			new Controlled(),
		);

		// test wall
		createTile(
			vec2(5, 5),
			{ backgroundColor: "blue" },
			new Collider({ isSolid: True }),
		);

		// test wall of death
		createTile(
			vec2(5, 4),
			{ backgroundColor: "black" },
			new Collider({
				onCollide() {
					alert("game over!");
				},
				isSolid: True,
			}),
		);

		// test apple
		createTile(
			vec2(5, 6),
			{ backgroundColor: "green" },
			new Collider({
				onCollide(entity) {
					console.log({ entity, player, same: entity === player })
					if (entity === player) {
						const snake = player.$(Snake);
						const tail = snake.getTailEntity();
						const tailPosition = tail.$(Position2D).position;

						snake.grow(createSnakePart(tailPosition.clone()));
					}
				},
				isSolid: False,
			}),
		);

		document.addEventListener("keydown", (e) => {
			const handler = keyHandlers[e.key];

			handler?.();
		});

		world.update();
		renderer.update();
	}, []);

	return (
		<>
			<div className="world" ref={gameRef} />
		</>
	);
}

export default App;