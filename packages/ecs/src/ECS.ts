import { Entity, type EntityId } from "./Entity";
import type { System } from "./System";
import { v4 } from "uuid";

export class ECS {
	private entities = new Map<EntityId, Entity>();
	private systems = new Map<System, Set<Entity>>();

	private entitiesToDestroy = new Array<Entity>();

	public addEntity(): Entity {
		const id = v4();
		const entity = new Entity(id, this);

		this.entities.set(id, entity);

		return entity;
	}

	public getSystemEntities(system: System) {
		return this.systems.get(system);
	}

	/**
	 * Marks `entity` for removal. The actual removal happens at the end
	 * of the next `update()`. This way we avoid subtle bugs where an
	 * Entity is removed mid-`update()`, with some Systems seeing it and
	 * others not.
	 */
	public removeEntity(entity: Entity): void {
		this.entitiesToDestroy.push(entity);
	}

	public addSystem(system: System): void {
		if (system.componentsRequired.size === 0) {
			console.warn("System not added: empty Components list.");
			console.warn(system);
			return;
		}

		system.ecs = this;

		this.systems.set(system, new Set());

		for (const entity of this.entities.values()) {
			this.updateEntitySystem(entity, system);
		}
	}

	public removeSystem(system: System): void {
		this.systems.delete(system);
	}

	public update(): void {
		for (const system of this.systems.keys()) {
			system.update();
		}

		this.destoryPendingEntities();
	}

	public destoryPendingEntities() {
		while (this.entitiesToDestroy.length > 0) {
			this.destroyEntity(this.entitiesToDestroy.pop()!);
		}
	}

	private destroyEntity(entity: Entity): void {
		this.entities.delete(entity.id);
		for (const entities of this.systems.values()) {
			entities.delete(entity);
		}
	}

	public updateEntitySystems(entity: Entity): void {
		for (const system of this.systems.keys()) {
			this.updateEntitySystem(entity, system);
		}
	}

	private updateEntitySystem(entity: Entity, system: System): void {
		const need = system.componentsRequired;

		if (entity.components.hasAll(need)) {
			const systemEntities = this.systems.get(system)!;
			if (!systemEntities.has(entity)) {
				systemEntities.add(entity);
				system.onEntityAdded(entity);
			}
		} else {
			const systemEntities = this.systems.get(system)!;
			if (systemEntities.has(entity)) {
				system.onEntityRemoved(entity);
				systemEntities.delete(entity);
			}
		}
	}
}
