// export type EntityId = string;

import type { Component } from "./Component";
import { ComponentContainer } from "./ComponentContainer";
import type { ECS } from "./ECS";

export type EntityId = Entity["id"];

export class Entity {
	components: ComponentContainer;

	constructor(
		public readonly id: string,
		public readonly ecs: ECS,
	) {
		this.components = new ComponentContainer(this, ecs);
	}

	public $<T extends new (...args: any) => Component>(
		componentClass: T,
	): InstanceType<T> {
		return this.components.get(componentClass);
	}
}
