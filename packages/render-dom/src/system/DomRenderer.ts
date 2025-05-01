import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { DomRenderable } from "../component/DomRenderable";
import { Position2D } from "../component/util/Position2D";
import { Moving, Snake } from "@snaekit/core";
import { vec2, type Point2D } from "@sgty/point";
import { Direction } from "../component/util/Direction";

function turnDirection(currentAngleDegrees: number, nextAngleDegrees: number) {
	let delta = nextAngleDegrees - currentAngleDegrees;

	// Normalize to [-180, 180]
	if (delta > 180) delta -= 360;
	if (delta < -180) delta += 360;

	return delta > 0 ? "left" : "right";
}

export class DomRenderer extends System {
	componentsRequired: Set<ComponentClass> = new Set([
		DomRenderable,
		Position2D,
	]);

	constructor(public readonly root: HTMLElement) {
		super();

		this.useEffect((entity) => {
			const domRenderable = entity.$(DomRenderable);

			const target = domRenderable._layer ?? this.root;

			target.appendChild(domRenderable.element);

			return () => {
				target.removeChild(domRenderable.element);
			};
		}, []);

		this.useEffect(
			(entity) => {
				const domRenderable = entity.$(DomRenderable);
				const position = entity.$(Position2D);

				domRenderable.element.style.setProperty(
					"left",
					`calc(var(--cell-size) * ${position.position.x})`,
				);
				domRenderable.element.style.setProperty(
					"top",
					`calc(var(--cell-size) * ${position.position.y})`,
				);
			},
			[Position2D],
		);

		// this.useEffect(
		// 	(entity) => {
		// 		const domRenderable = entity.$(DomRenderable);
		// 		const moving = entity.$(Moving<Point2D>);

		// 		if (!moving) return;

		// 		domRenderable.element.style.setProperty(
		// 			"transform",
		// 			`rotate(${moving.direction.angleDeg()}deg)`,
		// 		);
		// 	},
		// 	[Moving<Point2D>],
		// );

		this.useEffect(
			(entity) => {
				const domRenderable = entity.$(DomRenderable);
				const head = entity.$(Snake.Head);

				if (!head) return;

				domRenderable.element.classList.add("head");

				return () => {
					domRenderable.element.classList.remove("head");
				};
			},
			[Snake.Head],
		);

		this.useEffect(
			(entity) => {
				const domRenderable = entity.$(DomRenderable);
				const tail = entity.$(Snake.Tail);

				if (!tail) return;

				domRenderable.element.classList.add("tail");

				return () => {
					domRenderable.element.classList.remove("tail");
				};
			},
			[Snake.Tail],
		);

		this.useEffect(
			(entity) => {
				const domRenderable = entity.$(DomRenderable);
				const moving = entity.$(Moving<Point2D>);
				const tail = entity.$(Snake.Tail);
				const node = entity.$(Snake.Node);

				if (!moving) return;

				let facing = moving.direction;

				if (tail && node.prev) {
					const prev = node.prev;
					const moving = prev!.entity.$(Moving<Point2D>);

					facing = moving.direction;
				}

				// domRenderable.element.style.setProperty(
				// 	"transform",
				// 	`rotate(${facing.angleDeg()}deg)`,
				// );
				domRenderable.element.classList.remove("up", "down", "left", "right");
				if (facing.equals(Direction.DOWN)) {
					domRenderable.element.classList.add("down");
				} else if (facing.equals(Direction.UP)) {
					domRenderable.element.classList.add("up");
				} else if (facing.equals(Direction.LEFT)) {
					domRenderable.element.classList.add("left");
				} else if (facing.equals(Direction.RIGHT)) {
					domRenderable.element.classList.add("right");
				}

				if (node.next && node.prev) {
					const prevDir = node.prev.entity.$(Moving<Point2D>).direction;
					const curDir = entity.$(Moving<Point2D>).direction;

					domRenderable.element.classList.remove("turnRight", "turnLeft");

					if (!curDir.equals(prevDir)) {
						const turnDir = turnDirection(
							curDir.angleDeg(),
							prevDir.angleDeg(),
						);

						domRenderable.element.classList.add(
							turnDir === "right" ? "turnLeft" : "turnRight",
						);
					}
				}
			},
			[Moving],
		);
	}

	init(): void {
		this.update(0);
	}

	onEntityAdded(entity: Entity): void {
		super.onEntityAdded(entity);
	}

	public createLayer() {
		const el = document.createElement("div");
		el.classList.add("layer");

		this.root.appendChild(el);

		return el;
	}
}
