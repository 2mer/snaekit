import type { Component, ComponentClass } from "./Component";
import type { ECS } from "./ECS";
import type { Entity } from "./Entity";

export class ComponentContainer {
	constructor(
		public entity: Entity,
		public ecs: ECS,
	) {}

	private map = new Map<ComponentClass, Component>();

	public add(...components: Component[]): void {
		for (const component of components) {
			this.map.set(component.constructor as ComponentClass, component);
			component.entity = this.entity;
			component.onAdded();
		}
		this.ecs.updateEntitySystems(this.entity);
	}

	public get<T extends ComponentClass>(componentClass: T): InstanceType<T> {
		return this.map.get(componentClass) as InstanceType<T>;
	}

	public has(componentClass: ComponentClass): boolean {
		return this.map.has(componentClass);
	}

	public hasAll(componentClasses: Iterable<ComponentClass>): boolean {
		for (const cls of componentClasses) {
			if (!this.map.has(cls)) {
				return false;
			}
		}
		return true;
	}

	public delete(componentClass: ComponentClass): void {
		if (this.map.has(componentClass)) {
			const entry = this.map.get(componentClass)!;
			entry.onRemoved();
			this.map.delete(componentClass);
		}
	}
}
