import type { Point2D } from "@sgty/point";
import { Direction } from "@snaekit/core";
import { Component } from "@snaekit/ecs";

export class Moving extends Component {
	enabled = true;
	sleep = 0;
	direction: Point2D = Direction.STILL.clone();

	constructor(public onMoveStopped?: () => void) {
		super();
	}
}
