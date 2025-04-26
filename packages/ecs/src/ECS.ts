import EventEmitter from "eventemitter3";
import type { Component, ComponentClass } from "./Component";
import { Effects } from "./Effects";
import { Entity, type EntityId } from "./Entity";
import type { System, SystemClass } from "./System";
import { v4 } from "uuid";

export type ECSEvents = {
	destroy: () => void;
	init: () => void;
};

export class ECS {
	private entities = new Map<EntityId, Entity>();
	private systems = new Map<SystemClass, System>();
	private systemPriority = new Map<SystemClass, number>();
	public effects = new Effects<number>();
	public events = new EventEmitter<ECSEvents>();
	private initialized = false;

	private sortedSystems!: System[];

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

	public addSystem<T extends System>(system: T, priority = 0): T {
		system.ecs = this;

		this.systems.set(system.constructor as SystemClass, system);

		for (const entity of this.entities.values()) {
			this.updateEntitySystem(entity, system);
		}

		this.systemPriority.set(system.constructor as SystemClass, priority);

		this.computeSystemOrder();

		if (this.initialized) {
			system.init();
		}

		return system;
	}

	private computeSystemOrder() {
		this.sortedSystems = Array.from(this.systems.values()).sort(
			(systemA, systemB) => {
				const priorityA =
					this.systemPriority.get(systemA.constructor as SystemClass) ?? 0;
				const priorityB =
					this.systemPriority.get(systemB.constructor as SystemClass) ?? 0;

				return priorityA - priorityB;
			},
		);
	}

	public getSystem<T extends SystemClass>(system: T) {
		return this.systems.get(system) as InstanceType<T> | undefined;
	}

	public removeSystem(system: System): void {
		this.systems.delete(system.constructor as SystemClass);
	}

	private lastUpdate = 0;
	public update(): void {
		const now = Date.now();
		const delta = now - this.lastUpdate;
		this.lastUpdate = now;

		this.sortedSystems.forEach((system) => {
			system.update(delta);
		});
		this.effects.run(delta);
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

	public setPriorities(priorities: Map<SystemClass, number>) {
		this.systemPriority = priorities;
		this.computeSystemOrder();
	}

	public destroy() {
		this.events.emit("destroy");

		this.systems.forEach((system) => {
			system.destroy();
		});
		this.entities.forEach((entity) => {
			entity.destroy();
		});

		this.events.removeAllListeners();
	}

	/**
	 * Systems/components can register to the init event in order to setup initial values before the first update
	 * this is useful for systems that want to have their update function called on start without having a reference to the ecs update function
	 */
	public init() {
		if (this.initialized) {
			console.warn("ECS is already initialized");
			return;
		}

		this.systems.forEach((system) => {
			system.init();
		});

		this.events.emit("init");
	}
}
