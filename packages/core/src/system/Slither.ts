import type { GenericPoint } from "@sgty/point";
import { type ComponentClass, System } from "@snaekit/ecs";
import { Snake } from "../component/Snake";
import { Movement } from "./Movement";
import { WishDir } from "../component/WishDir";

export class Slither<T extends GenericPoint<T>> extends System {
	componentsRequired: Set<ComponentClass> = new Set([Snake<T>, WishDir<T>]);

	update(): void {
		const movement = this.ecs.getSystem(Movement<T>)!;

		for (const entity of this.entities) {
			const snake = entity.$(Snake<T>);
			const wishDir = entity.$(WishDir<T>);

			snake.propagateMotion(movement, wishDir.direction);
		}
	}
}
