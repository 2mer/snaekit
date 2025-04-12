import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Position } from "../component/Position";
import type { WorldMap } from "@snaekit/core";

export class World<TPos> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Position]);

	constructor(public readonly worldMap: WorldMap<TPos, Set<Entity>>) {
		super();
	}

	onEntityAdded(entity: Entity): void {
		const pos = entity.$(Position<TPos>);
		const cell = this.worldMap.get(pos.position) ?? new Set<Entity>();

		cell.add(entity);

		this.worldMap.set(pos.position, cell);
	}

	onEntityRemoved(entity: Entity): void {
		const pos = entity.$(Position<TPos>);
		const cell = this.worldMap.get(pos.position);

		cell.delete(entity);

		this.worldMap.set(pos.position, cell);
	}

	updateEntity(entity: Entity, updateFn: () => void): void {
		this.onEntityRemoved(entity);

		updateFn();

		this.onEntityAdded(entity);
	}

	getEntitiesAt(position: TPos) {
		return this.worldMap.get(position);
	}
}
