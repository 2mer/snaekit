import { Gut } from "@snaekit/core";
import type { Entity } from "@snaekit/ecs";

export function linkGuts(gutLinkedEntities: Entity[]) {
	let gutLocked = false;

	const createGutLogic = (baseLogic: (this: Gut, edible: Entity) => void) =>
		function sharedGutLogic(this: Gut, edible: Entity) {
			baseLogic.call(this, edible);
			if (gutLocked) return;

			const entitiesToFeed = gutLinkedEntities.filter((e) => e !== this.entity);

			gutLocked = true;
			entitiesToFeed.forEach((e) => {
				e.$(Gut).onEat(edible);
			});
			gutLocked = false;
		};

	gutLinkedEntities.forEach((e) => {
		const baseLogic = e.$(Gut).onEat;
		e.$(Gut).onEat = createGutLogic(baseLogic);
	});
}
