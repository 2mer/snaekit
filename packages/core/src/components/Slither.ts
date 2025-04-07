import { Point2D } from "@sgty/point";
import { Direction } from "../util/Direction";
import { Component, type EntityId } from "@snaekit/ecs";

export class Slither extends Component {
	tiles: EntityId[] = [];
	positions: Point2D[] = [];
	length = 0;
	headPosition: Point2D = new Point2D();
	direction: Point2D = Direction.RIGHT;

	setDirection(direction: Point2D) {
		this.direction = direction;
	}

	getNextHeadPosition() {
		const nextPosition = this.headPosition.add(this.direction).clone();
		return nextPosition;
	}

	advance() {
		this.positions.unshift(this.getNextHeadPosition());
	}

	growTile(tile: EntityId) {
		this.tiles.unshift(tile);
	}
}
