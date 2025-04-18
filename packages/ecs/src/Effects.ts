export type EffectCleanup = () => void;
export type Effect<T = void> = ((ctx: T) => EffectCleanup) | ((ctx: T) => void);
export type EffectEntry<T = void> = {
	effect: Effect<T>;
	once: boolean;
	cleanup?: EffectCleanup;
};

export class Effects<T = void> {
	private pendingEffects: EffectEntry<T>[] = [];

	run(ctx: T) {
		this.pendingEffects.forEach((e) => {
			e.cleanup?.();

			const c = e.effect(ctx);

			e.cleanup = c as EffectCleanup | undefined;
		});

		this.pendingEffects = this.pendingEffects.filter((e) => !e.once);
	}

	queue(effect: Effect<T>) {
		this.pendingEffects.push({ effect, once: false });
	}

	once(effect: Effect<T>) {
		this.pendingEffects.push({ effect, once: true });
	}

	add(effectEntry: EffectEntry<T>) {
		this.pendingEffects.push(effectEntry);
	}
}
