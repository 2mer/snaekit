import { type Point2D, vec2 } from "@sgty/point";
import { Controlled, Moving, Snake, WishDir } from "@snaekit/core";
import { DomRenderable, Position2D } from "@snaekit/render-dom";
import { Example } from "../util/Example";
import simple from "./simple";

export default Example((root, ecs) => {
	simple(root, ecs);

	const [player] = ecs.query(Snake);

	player.$(Position2D).position.set(3, 3);

	const playerMirror = ecs.addEntity(
		new Position2D(vec2(6, 6)),
		new DomRenderable()
			.cls("tile")
			.styled({ backgroundColor: "blue", zIndex: "10" }),
		new Moving(vec2()),
		new WishDir(vec2()),
		new Snake(),
		new Controlled<Point2D>((dir) => dir.clone().mul(-1)),
	);
});
