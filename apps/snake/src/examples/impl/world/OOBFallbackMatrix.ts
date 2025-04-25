import type { Point2D } from "@sgty/point";
import { Matrix } from "@snaekit/core";

export class OOBFallbackMatrix<T> extends Matrix<T> {
	constructor(
		width: number,
		height: number,
		public oobFallback: T,
	) {
		super(width, height);
	}

	get(position: Point2D): T {
		if (!this.has(position)) return this.oobFallback;

		return super.get(position);
	}
}
