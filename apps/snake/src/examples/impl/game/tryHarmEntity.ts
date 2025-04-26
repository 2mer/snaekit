import type { Entity } from "@snaekit/ecs";
import { Sensitive } from "../component/Sensitive";

export function tryHarmEntity({
	target,
	attacker,
}: { target: Entity; attacker: Entity }) {
	if (!target.components.has(Sensitive)) return;

	const sensitive = target.$(Sensitive);

	sensitive.onHarm(attacker);
}
