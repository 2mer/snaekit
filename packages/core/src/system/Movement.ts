import { type ComponentClass, System } from "@snaekit/ecs";
import { Moving } from "../component/Moving";
import { Position } from "../component/Position";
import type { GenericPoint } from "@sgty/point";

export class Movement<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Moving, Position]);

	update(delta: number) {
		for (const entity of this.entities) {
			const moving$ = entity.$(Moving<T>);
			const position$ = entity.$(Position<T>);

			if (moving$.sleep) {
				moving$.sleep--;
				continue;
			}

			if (!moving$.enabled) {
				continue;
			}

			const wishPos = position$.position.clone().add(moving$.direction);

			position$.position.set(wishPos);
			position$.onChanged();
		}

		this.effects.run(delta);
	}
}
