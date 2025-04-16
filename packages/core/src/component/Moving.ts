import type { GenericPoint } from "@sgty/point";
import { Component } from "@snaekit/ecs";

export class Moving<T extends GenericPoint<T>> extends Component {
	enabled = true;
	sleep = 0;

	constructor(
		public direction: T,
		public onMoveStopped?: () => void,
	) {
		super();
	}
}
