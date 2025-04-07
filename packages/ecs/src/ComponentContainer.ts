import type { Component } from "./Component";

export class ComponentContainer {
	private map = new Map<Function, Component>();

	public add(component: Component): void {
		this.map.set(component.constructor, component);
	}

	public get<T extends typeof Component>(componentClass: T): InstanceType<T> {
		return this.map.get(componentClass) as InstanceType<T>;
	}

	public has(componentClass: Function): boolean {
		return this.map.has(componentClass);
	}

	public hasAll(componentClasses: Iterable<Function>): boolean {
		for (const cls of componentClasses) {
			if (!this.map.has(cls)) {
				return false;
			}
		}
		return true;
	}

	public delete(componentClass: Function): void {
		this.map.delete(componentClass);
	}
}
