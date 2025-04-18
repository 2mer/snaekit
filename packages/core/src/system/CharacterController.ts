import { type ComponentClass, Effects, System } from "@snaekit/ecs";
import type { GenericPoint } from "@sgty/point";
import { Controlled } from "../component/Controlled";
import { WishDir } from "../component/WishDir";

export class CharacterController<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([
		Controlled<T>,
		WishDir<T>,
	]);

	effects = new Effects();

	update(): void {
		this.effects.run();
	}

	setMoveDirection(direction: T) {
		this.effects.once(() => {
			for (const entity of this.entities) {
				const controlled = entity.$(Controlled<T>);
				const wishDir = entity.$(WishDir<T>);

				wishDir.direction = controlled.getWishDir(direction);
			}
		});
	}
}
