import type { GenericPoint } from "@sgty/point";
import { Component } from "@snaekit/ecs";

export class WishDir<T extends GenericPoint<T>> extends Component {
	constructor(public direction: T) {
		super();
	}
}
