import type { Component, ComponentClass } from "./Component";
import { type Effect, type EffectEntry, Effects } from "./Effects";
import type { Entity } from "./Entity";

type EffectDefinition = { effect: Effect<Entity>; deps: ComponentClass[] };

type EntityEffectContext = {
	queue: Effects<Entity>;
	effectEntriesMap: Map<EffectDefinition, EffectEntry<Entity>>;
};

export class EntityEffects {
	// all effect definitions
	effectDefinitions = new Set<EffectDefinition>();

	entityEffectMap = new Map<Entity, EntityEffectContext>();
	depToEffectDefinitionMap = new Map<ComponentClass, Set<EffectDefinition>>();

	constructor() {
		this.handleComponentChanged = this.handleComponentChanged.bind(this);
	}

	public addEffect(effect: Effect<Entity>, deps: ComponentClass[]) {
		const entry = { effect, deps };

		this.effectDefinitions.add(entry);

		deps.forEach((dep) => {
			if (!this.depToEffectDefinitionMap.has(dep)) {
				this.depToEffectDefinitionMap.set(dep, new Set());
			}

			this.depToEffectDefinitionMap.get(dep)!.add(entry);
		});

		return entry;
	}

	public destroy() {
		for (const entity of this.entityEffectMap.keys()) {
			this.unmountEntity(entity);
		}

		this.entityEffectMap.clear();
		this.effectDefinitions.clear();
	}

	private handleComponentChanged(entity: Entity, component: Component) {
		const ctx = this.entityEffectMap.get(entity)!;

		const relevantDefinitions = this.depToEffectDefinitionMap.get(
			component.constructor as ComponentClass,
		);
		if (!relevantDefinitions) return;

		for (const effectDefinition of relevantDefinitions) {
			const effectEntry = ctx.effectEntriesMap.get(effectDefinition)!;

			ctx.queue.add(effectEntry);
		}
	}

	public addEntity(entity: Entity) {
		if (!this.effectDefinitions.size) return;

		if (!this.entityEffectMap.has(entity)) {
			this.entityEffectMap.set(entity, {
				queue: new Effects(),
				effectEntriesMap: new Map(),
			});
		}

		const ctx = this.entityEffectMap.get(entity)!;

		// run mount effects
		for (const effectDefinition of this.effectDefinitions.values()) {
			const effectEntry = { effect: effectDefinition.effect, once: true };

			ctx.effectEntriesMap.set(effectDefinition, effectEntry);
			ctx.queue.add(effectEntry);
		}

		entity.events.on("componentChanged", this.handleComponentChanged);
	}

	public removeEntity(entity: Entity) {
		if (!this.effectDefinitions.size) return;

		this.unmountEntity(entity);

		this.entityEffectMap.delete(entity);
	}

	private unmountEntity(entity: Entity) {
		entity.events.off("componentChanged", this.handleComponentChanged);

		const ctx = this.entityEffectMap.get(entity)!;

		// run unmount cleanup
		for (const effectEntry of ctx.effectEntriesMap.values()) {
			effectEntry.cleanup?.();
		}
	}

	public run() {
		for (const entity of this.entityEffectMap.keys()) {
			this.entityEffectMap.get(entity)!.queue.run(entity);
		}
	}
}
