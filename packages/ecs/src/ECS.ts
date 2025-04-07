import type { Component } from "./Component";
import { ComponentContainer } from "./ComponentContainer";
import type { EntityId } from "./Entity";
import type { System } from "./System";
import { v4 } from "uuid";

export class ECS {
	private entities = new Map<EntityId, ComponentContainer>();
	private systems = new Map<System, Set<EntityId>>();

	private entitiesToDestroy = new Array<EntityId>();

	public addEntity(): EntityId {
		const entity = v4();
		this.entities.set(entity, new ComponentContainer());
		return entity;
	}

	/**
	 * Marks `entity` for removal. The actual removal happens at the end
	 * of the next `update()`. This way we avoid subtle bugs where an
	 * Entity is removed mid-`update()`, with some Systems seeing it and
	 * others not.
	 */
	public removeEntity(entity: EntityId): void {
		this.entitiesToDestroy.push(entity);
	}

	public addComponent(entity: EntityId, component: Component): void {
		const found = this.entities.get(entity);
		if (found) {
			found.add(component);
			this.checkE(entity);
		}
	}

	public getComponents(entity: EntityId): ComponentContainer | undefined {
		return this.entities.get(entity);
	}

	public removeComponent(entity: EntityId, componentClass: Function): void {
		const found = this.entities.get(entity);
		if (found) {
			found.delete(componentClass);
			this.checkE(entity);
		}
	}

	public addSystem(system: System): void {
		if (system.componentsRequired.size === 0) {
			console.warn("System not added: empty Components list.");
			console.warn(system);
			return;
		}

		system.ecs = this;

		this.systems.set(system, new Set());
		for (const entity of this.entities.keys()) {
			this.checkES(entity, system);
		}
	}

	public removeSystem(system: System): void {
		this.systems.delete(system);
	}

	public update(): void {
		for (const [system, entities] of this.systems.entries()) {
			system.update(entities);
		}

		while (this.entitiesToDestroy.length > 0) {
			this.destroyEntity(this.entitiesToDestroy.pop()!);
		}
	}

	private destroyEntity(entity: EntityId): void {
		this.entities.delete(entity);
		for (const entities of this.systems.values()) {
			entities.delete(entity);
		}
	}

	private checkE(entity: EntityId): void {
		for (const system of this.systems.keys()) {
			this.checkES(entity, system);
		}
	}

	private checkES(entity: EntityId, system: System): void {
		const found = this.entities.get(entity);
		const need = system.componentsRequired;
		if (found?.hasAll(need)) {
			// should be in system
			this.systems.get(system)!.add(entity);
		} else {
			// should not be in system
			this.systems.get(system)!.delete(entity);
		}
	}
}
