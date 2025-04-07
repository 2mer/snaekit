import type { Point2D } from "@sgty/point";

export abstract class AbstractMatrix<T> {
	constructor(
		public readonly width: number,
		public readonly height: number = width,
	) {}

	abstract get(position: Point2D): T;
}

export class Matrix<T> extends AbstractMatrix<T> {
	private values: T[][];

	constructor(width: number, height: number = width) {
		super(width, height);

		this.values = Array.from({ length: height }, (_, i) =>
			Array.from({ length: width }),
		) as T[][];
	}

	get(position: Point2D): T {
		return this.values[position.y][position.x];
	}

	set(position: Point2D, value: T): void {
		this.values[position.y][position.x] = value;
	}
}
