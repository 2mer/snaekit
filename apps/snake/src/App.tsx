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
import { Position2D } from "./ecs/component/util/Position2D";

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
			new Collider({
				isSolid: False,
				onCollide(entity, direction) {
					const position$ = entity.$(Position2D);
					const moving$ = entity.$(Moving);

					const newPos = position$.position.clone().add(direction).map(v => {
						if (v >= WORLD_SIZE) return v % WORLD_SIZE;
						if (v < 0) return (WORLD_SIZE + v) % WORLD_SIZE;

						return v;
					});

					moving$.sleep = 1;

					world.updateEntity(entity, () => {
						position$.position.set(newPos);
					})
				},
			})
		);

		class OOBFallbackMatrix<T> extends Matrix<T> {
			constructor(width: number, height: number, public oobFallback: T) {
				super(width, height);
			}

			get(position: Point2D): T {
				if (!this.has(position)) return this.oobFallback;

				return super.get(position)
			}
		}

		const world = new World(new OOBFallbackMatrix(WORLD_SIZE, WORLD_SIZE, new Set([OOB_TILE])));
		const renderer = new DomRenderer(gameEl);
		const movement = new Movement(world);
		const controller = new CharacterController(movement);

		ecs.addSystem(world);
		ecs.addSystem(renderer);
		ecs.addSystem(movement);
		ecs.addSystem(controller);

		function createTile(position: Point2D, styles: Partial<CSSStyleDeclaration>, ...components: Component[]) {
			const entity = ecs.addEntity();

			const el = document.createElement("div");
			el.classList.add("tile");

			entity.components.add(
				new Position(position),
				new Tile(),
				new DomRenderable(el).styled(styles),
				...components,
			);

			return entity;
		}

		function createSnakePart(position?: Point2D) {
			const part = createTile(position ?? vec2(), { backgroundColor: player.$(Snake).parts.length % 2 === 0 ? 'orange' : 'yellow' }, new Moving(), new Collider({ isSolid: True }))

			return part;
		}

		// function createApple(position: Point2D) {
		// 	const apple = createTile(position, { backgroundColor: 'green', borderRadius: '50%' }, new Collider((entity) => {
		// 		if (entity.components.has(Snake)) {
		// 			const snake = entity.$(Snake);

		// 			snake.grow(createSnakePart());
		// 		}

		// 		return false;
		// 	}))

		// 	return apple;
		// }

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

			ArrowLeft: () => {
				controller.setMoveDirection(Direction.LEFT);
				update();
			},
			ArrowDown: () => {
				controller.setMoveDirection(Direction.DOWN);
				update();
			},
			ArrowRight: () => {
				controller.setMoveDirection(Direction.RIGHT);
				update();
			},
			ArrowUp: () => {
				controller.setMoveDirection(Direction.UP);
				update();
			},
		} as Record<string, () => void>;

		const player = createTile(vec2(0, 0), { backgroundColor: 'red', zIndex: '10' }, new Moving(), new Snake());

		// test wall
		createTile(vec2(5, 5), { backgroundColor: 'blue' }, new Collider({ isSolid: True }))

		// test wall of death
		createTile(vec2(5, 4), { backgroundColor: 'black' }, new Collider({
			onCollide() {
				alert('game over!')
			},
			isSolid: True,
		}))

		// test apple
		createTile(
			vec2(5, 6),
			{ backgroundColor: 'green' },
			new Collider({
				onCollide(entity) {
					if (entity === player) {
						const snake = player.$(Snake);
						const tail = snake.getTailEntity();
						const tailPosition = tail.$(Position2D).position;

						snake.grow(createSnakePart(tailPosition.clone()));
					}
				},
				isSolid: False,
			})
		)

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
