import { type ComponentClass, Effects, System } from "@snaekit/ecs";

export class Growing extends System {
	componentsRequired: Set<ComponentClass> = new Set();
	effects = new Effects<number>();

	update(delta: number): void {
		super.update(delta);

		this.effects.run(delta);
	}
}
