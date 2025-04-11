import type { Point2D } from "@sgty/point";
import { Component } from "@snaekit/ecs";

export class Position extends Component {
	constructor(public position: Point2D) {
		super();
	}
}
