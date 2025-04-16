import type { GenericPoint } from "@sgty/point";
import { Component } from "@snaekit/ecs";

export class Position<T extends GenericPoint<T>> extends Component {
	constructor(public position: T) {
		super();
	}
}
