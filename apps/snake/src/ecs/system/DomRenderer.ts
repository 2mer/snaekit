import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { DomRenderable } from "../component/DomRenderable";
import { Position } from "../component/Position";

export class DomRenderer extends System {
	componentsRequired: Set<ComponentClass> = new Set([DomRenderable, Position]);

	constructor(public readonly root: HTMLElement) {
		super();
	}

	update() {
		const entities = this.ecs.getSystemEntities(this)!;

		for (const entity of entities) {
			const domRenderable = entity.$(DomRenderable);
			const position$ = entity.$(Position);

			domRenderable.element.style.setProperty(
				"left",
				`calc(var(--cell-size) * ${position$.position.x})`,
			);
			domRenderable.element.style.setProperty(
				"top",
				`calc(var(--cell-size) * ${position$.position.y})`,
			);
		}
	}

	onEntityAdded(entity: Entity): void {
		const domRenderable = entity.$(DomRenderable);
		const position = entity.$(Position);

		domRenderable.element.style.setProperty(
			"left",
			`calc(var(--cell-size) * ${position.position.x})`,
		);
		domRenderable.element.style.setProperty(
			"top",
			`calc(var(--cell-size) * ${position.position.y})`,
		);

		this.root.appendChild(domRenderable.element);
	}

	onEntityRemoved(entity: Entity): void {
		const domRenderable = entity.$(DomRenderable);

		this.root.removeChild(domRenderable.element);
	}
}
