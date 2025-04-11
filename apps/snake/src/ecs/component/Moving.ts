import type { Point2D } from "@sgty/point";
import { Direction } from "@snaekit/core";
import { Component } from "@snaekit/ecs";

export class Moving extends Component {
	direction: Point2D = Direction.RIGHT;
}
