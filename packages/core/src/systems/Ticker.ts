import { type EntityId, System } from "@snaekit/ecs";
import { Tickable } from "../components/Tickable";

export class Ticker extends System {
	componentsRequired: Set<Function> = new Set([Tickable]);

	update(entities: Set<EntityId>): void {
		for (const entity of entities) {
			this.ecs.getComponents(entity);
		}
	}
}
