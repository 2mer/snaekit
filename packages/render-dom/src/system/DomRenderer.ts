import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { DomRenderable } from "../component/DomRenderable";
import { Position2D } from "../component/util/Position2D";
import { Moving, Snake } from "@snaekit/core";
import type { Point2D } from "@sgty/point";

export class DomRenderer extends System {
	componentsRequired: Set<ComponentClass> = new Set([
		DomRenderable,
		Position2D,
	]);

	constructor(public readonly root: HTMLElement) {
		super();

		this.useEffect((entity) => {
			const domRenderable = entity.$(DomRenderable);

			this.root.appendChild(domRenderable.element);

			return () => {
				this.root.removeChild(domRenderable.element);
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

				domRenderable.element.style.setProperty(
					"transform",
					`rotate(${facing.angleDeg()}deg)`,
				);
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
}
