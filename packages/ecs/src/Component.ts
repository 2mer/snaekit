import type { Entity } from "./Entity";

export abstract class Component {
	public entity: Entity = undefined as unknown as any;

	public onAdded() {}
	public onRemoved() {}

	public onChanged() {
		this.entity.events.emit("componentChanged", this.entity, this);
	}

	public destroy() {}
}

export type ComponentClass = new (...args: any) => Component;
