import type { ECS } from "@snaekit/ecs";

export type ExampleContext = {
	root: HTMLDivElement;
	ecs: ECS;
	onGameOver: () => void;
	onRestart: () => void;
};

export type Example =
	| ((ctx: ExampleContext) => void)
	| ((ctx: ExampleContext) => () => void);
export function Example(e: Example) {
	return e;
}
