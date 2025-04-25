import type { ECS } from "@snaekit/ecs";

export type Example =
	| ((root: HTMLDivElement, ecs: ECS) => void)
	| ((root: HTMLDivElement, ecs: ECS) => () => void);
export function Example(e: Example) {
	return e;
}
