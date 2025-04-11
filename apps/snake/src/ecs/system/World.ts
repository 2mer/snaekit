import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Position } from "../component/Position";
import type { Matrix } from "@snaekit/core";
import type { Point2D } from "@sgty/point";

export class World extends System {
	componentsRequired: Set<ComponentClass> = new Set([Position]);

	constructor(public readonly matrix: Matrix<Set<Entity>>) {
		super();
	}

	onEntityAdded(entity: Entity): void {
		const pos = entity.$(Position);
		const cell = this.matrix.get(pos.position) ?? new Set<Entity>();

		cell.add(entity);

		this.matrix.set(pos.position, cell);
	}

	onEntityRemoved(entity: Entity): void {
		const pos = entity.$(Position);
		const cell = this.matrix.get(pos.position);

		cell.delete(entity);

		this.matrix.set(pos.position, cell);
	}

	updateEntity(entity: Entity, updateFn: () => void): void {
		this.onEntityRemoved(entity);

		updateFn();

		this.onEntityAdded(entity);
	}

	getEntitiesAt(position: Point2D) {
		return this.matrix.get(position);
	}
}
