import { Gut, Moving, Snake } from "@snaekit/core";
import { createSimpleSnakePart } from "./createSimpleSnakePart";

export function simpleGutLogic(this: Gut) {
	if (this.entity.components.has(Snake)) {
		const snake = this.entity.$(Snake);

		const part = createSimpleSnakePart(this.entity.ecs, this.entity);
		snake.grow(part);

		part.$(Moving).sleep++;
	}
}

export function simpleGut() {
	return new Gut(simpleGutLogic);
}
