import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { DomRenderable } from "../component/DomRenderable";
import { Position2D } from "../component/util/Position2D";

export class DomRenderer extends System {
	componentsRequired: Set<ComponentClass> = new Set([
		DomRenderable,
		Position2D,
	]);

	constructor(public readonly root: HTMLElement) {
		super();

		this.useEffect((entity) => {
			const domRenderable = entity.$(DomRenderable);
			console.log("in effect");

			this.root.appendChild(domRenderable.element);

			return () => {
				console.log("cleanup!");
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
	}

	onEntityAdded(entity: Entity): void {
		super.onEntityAdded(entity);
	}
}
