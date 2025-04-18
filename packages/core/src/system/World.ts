import { type ComponentClass, type Entity, System } from "@snaekit/ecs";
import { Position } from "../component/Position";
import type { WorldMap } from "../data/WorldMap";
import type { GenericPoint } from "@sgty/point";

export class World<TPos extends GenericPoint<TPos>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Position<TPos>]);

	constructor(public readonly worldMap: WorldMap<TPos, Set<Entity>>) {
		super();

		this.useEffect(
			(entity) => {
				const pos = entity.$(Position<TPos>).position.clone();
				const cell = this.worldMap.get(pos) ?? new Set<Entity>();

				cell.add(entity);

				this.worldMap.set(pos, cell);

				return () => {
					cell.delete(entity);

					this.worldMap.set(pos, cell);
				};
			},
			[Position],
		);
	}

	// onEntityAdded(entity: Entity): void {
	// 	const pos = entity.$(Position<TPos>);
	// 	const cell = this.worldMap.get(pos.position) ?? new Set<Entity>();

	// 	cell.add(entity);

	// 	this.worldMap.set(pos.position, cell);
	// }

	// onEntityRemoved(entity: Entity): void {
	// 	const pos = entity.$(Position<TPos>);
	// 	const cell = this.worldMap.get(pos.position);

	// 	cell.delete(entity);

	// 	this.worldMap.set(pos.position, cell);
	// }

	// updateEntity(entity: Entity, updateFn: () => void): void {
	// 	this.onEntityRemoved(entity);

	// 	updateFn();

	// 	this.onEntityAdded(entity);
	// }

	getEntitiesAt(position: TPos) {
		return this.worldMap.get(position);
	}
}
