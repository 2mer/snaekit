import type { ComponentClass } from "./Component";
import type { ECS } from "./ECS";
import type { Entity } from "./Entity";

export abstract class System {
	/**
	 * Set of Component classes, ALL of which are required before the
	 * system is run on an entity.
	 *
	 * This should be defined at compile time and should never change.
	 */
	public abstract componentsRequired: Set<ComponentClass>;

	public update() {}

	public onEntityAdded(entity: Entity) {}

	public onEntityRemoved(entity: Entity) {}

	/**
	 * The ECS is given to all Systems. Systems contain most of the game
	 * code, so they need to be able to create, mutate, and destroy
	 * Entities and Components.
	 */
	public ecs: ECS = undefined as unknown as any;
}
