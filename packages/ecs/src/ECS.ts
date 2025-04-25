import EventEmitter from "eventemitter3";
import type { Component, ComponentClass } from "./Component";
import { Effects } from "./Effects";
import { Entity, type EntityId } from "./Entity";
import type { System, SystemClass } from "./System";
import { v4 } from "uuid";

export type ECSEvents = {
	destroy: () => void;
};

export class ECS {
	private entities = new Map<EntityId, Entity>();
	private systems = new Map<SystemClass, System>();
	public effects = new Effects();
	public events = new EventEmitter<ECSEvents>();

	public addEntity(...components: Component[]): Entity {
		const id = v4();
		const entity = new Entity(id, this);

		this.entities.set(id, entity);

		entity.components.add(...components);

		return entity;
	}

	/**
	 * Marks `entity` for removal. The actual removal happens at the end
	 * of the next `update()`. This way we avoid subtle bugs where an
	 * Entity is removed mid-`update()`, with some Systems seeing it and
	 * others not.
	 */
	public removeEntity(entity: Entity): void {
		this.effects.queue(() => {
			this.destroyEntity(entity);
		});
	}

	public addSystem(system: System): void {
		if (system.componentsRequired.size === 0) {
			console.warn("System not added: empty Components list.");
			console.warn(system);
			return;
		}

		system.ecs = this;

		this.systems.set(system.constructor as SystemClass, system);

		for (const entity of this.entities.values()) {
			this.updateEntitySystem(entity, system);
		}
	}

	public getSystem<T extends SystemClass>(system: T) {
		return this.systems.get(system) as InstanceType<T> | undefined;
	}

	public removeSystem(system: System): void {
		this.systems.delete(system.constructor as SystemClass);
	}

	public update(logicFn: () => void): void {
		logicFn();

		this.effects.run();
	}

	private destroyEntity(entity: Entity): void {
		this.entities.delete(entity.id);
		for (const system of this.systems.values()) {
			system.entities.delete(entity);
		}
	}

	public updateEntitySystems(entity: Entity): void {
		for (const system of this.systems.values()) {
			this.updateEntitySystem(entity, system);
		}
	}

	private updateEntitySystem(entity: Entity, system: System): void {
		const need = system.componentsRequired;

		if (entity.components.hasAll(need)) {
			if (!system.entities.has(entity)) {
				system.entities.add(entity);
				system.onEntityAdded(entity);
			}
		} else {
			if (system.entities.has(entity)) {
				system.onEntityRemoved(entity);
				system.entities.delete(entity);
			}
		}
	}

	public query(...components: ComponentClass[]): Entity[] {
		return Array.from(this.entities.values()).filter((entity) => {
			return entity.components.hasAll(components);
		});
	}

	destroy() {
		this.events.emit("destroy");

		this.systems.forEach((system) => {
			system.destroy();
		});
		this.entities.forEach((entity) => {
			entity.destroy();
		});

		this.events.removeAllListeners();
	}
}
