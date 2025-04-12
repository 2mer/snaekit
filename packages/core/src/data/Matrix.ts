import type { Point2D } from "@sgty/point";
import { WorldMap } from "./WorldMap";

export class Matrix<T> extends WorldMap<Point2D, T> {
	private values: T[][];

	constructor(
		public readonly width: number,
		public readonly height: number = width,
	) {
		super();

		this.values = Array.from({ length: height }, (_, i) =>
			Array.from({ length: width }),
		) as T[][];
	}

	get(position: Point2D): T {
		return this.values?.[position.y]?.[position.x];
	}

	set(position: Point2D, value: T): void {
		this.values[position.y][position.x] = value;
	}

	has(position: Point2D) {
		if (position.x < 0) return false;
		if (position.y < 0) return false;
		if (position.x >= this.width) return false;
		if (position.y >= this.height) return false;

		return true;
	}
}
