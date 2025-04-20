import { ECS } from "@snaekit/ecs";
import { Point2D, vec2 } from "@sgty/point";
import {
	CharacterController,
	Collider,
	Controlled,
	Matrix,
	Movement,
	Moving,
	Slither,
	Snake,
	WishDir,
	World,
} from "@snaekit/core";
import { DomRenderable, DomRenderer, Position2D } from "@snaekit/render-dom";
import { Direction } from "../util/Direction";
import { Example } from "../util/Example";

const True = () => true;
const False = () => false;

export default Example((root) => {
	const ecs = new ECS();

	const CELL_SIZE = 50;
	const WORLD_SIZE = 10;

	root.style.setProperty("--cell-size", `${CELL_SIZE}px`);
	root.style.setProperty("--world-size", String(WORLD_SIZE));

	function getOverflowPosition(position: Point2D, direction: Point2D) {
		return position
			.clone()
			.add(direction)
			.map((v) => {
				if (v >= WORLD_SIZE) return v % WORLD_SIZE;
				if (v < 0) return (WORLD_SIZE + v) % WORLD_SIZE;

				return v;
			});
	}

	const OOB_TILE = ecs.addEntity();
	OOB_TILE.components.add(
		new Collider<Point2D>({
			isSolid: (entity, direction) => {
				const position$ = entity.$(Position2D);

				const newPos = getOverflowPosition(position$.position, direction);

				return Array.from(world.getEntitiesAt(newPos) ?? []).some((e) => {
					const collider = e.$(Collider);
					return collider?.options.isSolid(entity, direction);
				});
			},
			onCollide(entity, direction) {
				const position$ = entity.$(Position2D);
				const moving$ = entity.$(Moving);

				const newPos = getOverflowPosition(position$.position, direction);

				const ents = Array.from(world.getEntitiesAt(newPos) ?? []);
				ents.forEach((e) => {
					const collider = e.$(Collider);
					collider?.options?.onCollide?.(entity, direction);
				});

				if (
					ents.every((e) => {
						const collider = e.$(Collider);
						return !collider?.options?.isSolid?.(entity, direction);
					})
				) {
					moving$.sleep = 1;

					position$.position.set(newPos);
					position$.onChanged();
				}
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
	const renderer = new DomRenderer(root);
	const movement = new Movement(world);
	const controller = new CharacterController();
	const slither = new Slither();

	ecs.addSystem(world);
	ecs.addSystem(controller);
	ecs.addSystem(slither);
	ecs.addSystem(movement);
	ecs.addSystem(renderer);

	function createSnakePart(position?: Point2D) {
		const part = ecs.addEntity(
			new Position2D(position ?? vec2()),
			new DomRenderable()
				.cls("tile")
				.styled({ backgroundColor: "orange", zIndex: "10" }),
			new Moving(vec2()),
			new Collider({
				onCollide(entity) {
					if (entity === player) {
						alert("game over!");
					}
				},
				isSolid(entity) {
					return entity === player;
				},
			}),
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
		});
	}

	function handleMoveInDirection(direction: Point2D) {
		return () => {
			controller.setMoveDirection(direction);
			update();
		};
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
		new DomRenderable()
			.cls("tile")
			.styled({ backgroundColor: "red", zIndex: "10" }),
		new Moving(vec2()),
		new WishDir(vec2()),
		new Snake(),
		new Controlled(),
	);

	function lerp(min: number, max: number, progress: number) {
		return (max - min) * progress + min;
	}

	function randomFreePosition() {
		const pos = new Point2D(
			lerp(0, WORLD_SIZE, Math.random()),
			lerp(0, WORLD_SIZE, Math.random()),
		).round();

		const items = world.worldMap.get(pos);
		// roll again
		if (!items?.size) return pos;

		// roll again
		return randomFreePosition();
	}

	const apple = ecs.addEntity(
		new Position2D(randomFreePosition()),
		new DomRenderable()
			.cls("tile", "apple")
			.styled({ backgroundColor: "green", zIndex: "10" }),
		new Collider({
			onCollide(entity) {
				if (entity === player) {
					const snake = player.$(Snake);
					const tail = snake.getTailEntity();
					const tailPosition = tail.$(Position2D).position;

					snake.grow(createSnakePart(tailPosition.clone()));

					const myPos = apple.$(Position2D);
					myPos.position.set(randomFreePosition());
					myPos.onChanged();
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
});
