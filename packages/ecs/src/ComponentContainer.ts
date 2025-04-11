import type { Component, ComponentClass } from "./Component";
import type { ECS } from "./ECS";
import type { Entity } from "./Entity";

export class ComponentContainer {
	constructor(
		public entity: Entity,
		public ecs: ECS,
	) {}

	private map = new Map<Function, Component>();

	public add(...components: Component[]): void {
		for (const component of components) {
			this.map.set(component.constructor, component);
			component.entity = this.entity;
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
		this.map.delete(componentClass);
	}
}
