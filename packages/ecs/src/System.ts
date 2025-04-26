import type { ComponentClass } from "./Component";
import type { ECS } from "./ECS";
import type { Effect } from "./Effects";
import type { Entity } from "./Entity";
import { EntityEffects } from "./EntityEffects";

export type SystemClass = new (...args: any) => System;

export abstract class System {
	public entities = new Set<Entity>();
	private entityEffects = new EntityEffects();
	/**
	 * Set of Component classes, ALL of which are required before the
	 * system is run on an entity.
	 *
	 * This should be defined at compile time and should never change.
	 */
	public abstract componentsRequired: Set<ComponentClass>;

	public update(delta: number) {
		this.entityEffects.run();
	}

	public onEntityAdded(entity: Entity) {
		this.entityEffects.addEntity(entity);
	}

	public onEntityRemoved(entity: Entity) {
		this.entityEffects.removeEntity(entity);
	}

	public useEffect(effectFn: Effect<Entity>, deps: ComponentClass[]) {
		this.entityEffects.addEffect(effectFn, deps);
	}

	init() {}

	destroy() {
		this.entities.clear();
		this.entityEffects.destroy();
	}

	/**
	 * The ECS is given to all Systems. Systems contain most of the game
	 * code, so they need to be able to create, mutate, and destroy
	 * Entities and Components.
	 */
	public ecs: ECS = undefined as unknown as any;
}
