import type { Entity } from "./Entity";

export abstract class Component {
	public entity: Entity = undefined as unknown as any;

	public onAdded() {}
	public onRemoved() {}
}

export type ComponentClass = new (...args: any) => Component;
