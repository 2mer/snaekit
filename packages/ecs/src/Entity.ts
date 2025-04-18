import type { Component } from "./Component";
import { ComponentContainer } from "./ComponentContainer";
import type { ECS } from "./ECS";
import { EventEmitter } from "eventemitter3";

export type EntityId = Entity["id"];

export type EntityEvents = {
	componentChanged: (entity: Entity, component: Component) => void;
};

export class Entity {
	components: ComponentContainer;
	events = new EventEmitter<EntityEvents>();

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
