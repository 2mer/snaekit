import type { GenericPoint, Point2D } from "@sgty/point";
import { CharacterController } from "@snaekit/core";
import { Direction } from "../../../util/Direction";

type ControllerOptions = {} | { turnBased: true; update: () => void };

export function createSimpleController(options: ControllerOptions) {
	const controller = new CharacterController();

	function handleMoveInDirection(direction: Point2D) {
		return (e: any) => {
			controller.setMoveDirection(direction);
			e.preventDefault();
			if ("turnBased" in options) {
				options.update();
			}
		};
	}

	const keyHandlers = {
		a: handleMoveInDirection(Direction.LEFT),
		s: handleMoveInDirection(Direction.DOWN),
		d: handleMoveInDirection(Direction.RIGHT),
		w: handleMoveInDirection(Direction.UP),

		ArrowLeft: handleMoveInDirection(Direction.LEFT),
		ArrowDown: handleMoveInDirection(Direction.DOWN),
		ArrowRight: handleMoveInDirection(Direction.RIGHT),
		ArrowUp: handleMoveInDirection(Direction.UP),
	} as Record<string, (e: any) => void>;

	document.addEventListener("keydown", (e) => {
		const handler = keyHandlers[e.key];

		handler?.(e);
	});

	return controller;
}

export function ignoreBackwardDirection<T extends GenericPoint<T>>(
	wishDir: T,
	prevDir: T,
) {
	if (wishDir.clone().mul(-1).equals(prevDir)) {
		return prevDir;
	}

	return wishDir;
}
