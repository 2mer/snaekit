import { Example } from "../util/Example";
import { type ComponentClass, System } from "@snaekit/ecs";

export default Example(({ ecs }) => {
	class A extends System {
		componentsRequired: Set<ComponentClass> = new Set();
		update() {
			console.log("A");
		}
	}
	class B extends System {
		componentsRequired: Set<ComponentClass> = new Set();
		update() {
			console.log("B");
		}
	}
	class C extends System {
		componentsRequired: Set<ComponentClass> = new Set();
		update() {
			console.log("C");
		}
	}
	class D extends System {
		componentsRequired: Set<ComponentClass> = new Set();
		update() {
			console.log("D");
		}
	}

	// ------------

	ecs.addSystem(new A());
	ecs.addSystem(new B());
	ecs.addSystem(new C());

	ecs.update();
	console.log("-".repeat(10));

	// ------------

	ecs.addSystem(new D(), -1);

	ecs.update();
	console.log("-".repeat(10));

	// ------------

	const order = [D, A, C, B];
	ecs.setPriorities(new Map(order.map((system, i) => [system, i])));

	ecs.update();
	console.log("-".repeat(10));

	// ------------

	const orderMap = new Map([
		[A, 100],
		[B, 200],
		[C, -100],
		[D, 1500],
	]);

	ecs.setPriorities(orderMap);

	ecs.update();
});
