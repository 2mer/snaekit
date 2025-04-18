import type { GenericPoint } from "@sgty/point";
import { Component } from "@snaekit/ecs";

function identity<T>(v: T) {
	return v;
}

export class Controlled<T extends GenericPoint<T>> extends Component {
	constructor(public getWishDir: (input: T) => T = identity) {
		super();
	}
}
