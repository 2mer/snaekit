import type { Entity } from "./Entity";

export abstract class Component {
	public entity: Entity = undefined as unknown as any;

	public onAdded() {
		this.onChanged();
	}
	public onRemoved() {
		this.onChanged();
	}

	public onChanged() {
		this.entity.events.emit("componentChanged", this.entity, this);
	}

	public destroy() {}
}

export type ComponentClass = new (...args: any) => Component;
