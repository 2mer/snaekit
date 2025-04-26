import type { ECS } from "@snaekit/ecs";

export function useUpdateLoop(ecs: ECS) {
	ecs.events.on("init", () => {
		const loopInterval = setInterval(() => {
			ecs.update();
		}, 250);

		ecs.events.on("destroy", () => {
			clearInterval(loopInterval);
		});
	});
}
