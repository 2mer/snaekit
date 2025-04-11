import { Component, type Entity } from "@snaekit/ecs";

export class Snake extends Component {
	parts: Array<Entity> = [];
	length = 0;

	grow(entity: Entity) {
		this.parts.push(entity);
	}
}
