import { type Edible, Gut } from "@snaekit/core";
import type { Entity } from "@snaekit/ecs";

export function linkGuts(gutLinkedEntities: Entity[]) {
	let gutLocked = false;
	function sharedGutLogic(this: Gut, edible: Edible) {
		if (gutLocked) return;

		const entitiesToFeed = gutLinkedEntities.filter((e) => e !== this.entity);

		gutLocked = true;
		entitiesToFeed.forEach((e) => {
			edible.tryFeed(e);
		});
		gutLocked = false;
	}

	gutLinkedEntities.forEach((e) => {
		// e.components.delete(Gut);
		e.$(Gut).onEat = sharedGutLogic;
	});
}
