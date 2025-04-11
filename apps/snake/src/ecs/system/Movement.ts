import { type ComponentClass, System } from "@snaekit/ecs";
import { Moving } from "../component/Moving";
import { Position } from "../component/Position";
import type { World } from "./World";
import { Collider } from "../component/Collider";

export class Movement extends System {
	componentsRequired: Set<ComponentClass> = new Set([Moving, Position]);

	constructor(public world: World) {
		super();
	}

	update() {
		const entities = this.ecs.getSystemEntities(this)!;

		for (const entity of entities) {
			const moving$ = entity.$(Moving);
			const position$ = entity.$(Position);

			const wishPos = position$.position.clone().add(moving$.direction);

			let canMove = true;

			// check collision
			const entitiesAhead = this.world.matrix.get(wishPos);

			if (entitiesAhead) {
				for (const entityAhead of entitiesAhead.values()) {
					if (!entityAhead.components.has(Collider)) continue;

					const collider$ = entityAhead.$(Collider);
					const solid = collider$.onCollide(entity);

					canMove = !solid;
					break;
				}
			}

			if (!canMove) continue;

			// update the matrix
			this.world.updateEntity(entity, () => {
				position$.position.set(wishPos);
			});
		}
	}
}
