import { Component } from "@snaekit/ecs";
import type { Edible } from "./Edible";

export class Gut extends Component {
	public constructor(public onEat: (edible: Edible) => void = () => {}) {
		super();
	}
}
