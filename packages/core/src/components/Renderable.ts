import { Component } from "@snaekit/ecs";

export abstract class Renderable extends Component {
	abstract add(): void;

	abstract remove(): void;

	abstract update(): void;
}
