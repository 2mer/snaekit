import { Component, type Entity } from "@snaekit/ecs";
import { Gut } from "./Gut";

export class Edible extends Component {
	public constructor(public onConsumedBy: (diner: Entity) => void = () => {}) {
		super();
	}

	tryFeed(diner: Entity) {
		const gut = diner.$(Gut);
		if (gut) {
			this.onConsumedBy(diner);
			gut.onEat(this);
		}
	}
}
