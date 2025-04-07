import { type EntityId, System } from "@snaekit/ecs";
import { Renderable } from "../components/Renderable";

export class Renderer extends System {
	componentsRequired: Set<Function> = new Set([Renderable]);

	update(entities: Set<EntityId>): void {
		throw new Error("Method not implemented.");
	}
}
