import { useEffect, useMemo, useRef } from "react";
import type { Example, ExampleContext } from "./util/Example";
import { ECS } from "@snaekit/ecs";
import { localStorageSignal } from "./examples/impl/util/localStorageSignal";

const examples = import.meta.glob("./examples/*", { eager: true });
const examplesCode = import.meta.glob("./examples/*", { eager: true, query: '?raw' });
const exampleEntries = Object.entries(examples);
const exampleCodeEntries = Object.entries(examplesCode);

const exampleIndex$ = localStorageSignal('exampleIndex', 0);


function overflowN(value: number, min: number, max: number) {
	if (value >= max) {
		return (value % max) + min;
	}

	if (value < min) {
		return max + ((value - min) % max)
	}

	return value;
}

function App() {
	const gameRef = useRef<HTMLDivElement>(null);
	const exampleIndex = exampleIndex$.use();


	const currentExample = useMemo(() => {
		const [exPath, exMod] = exampleEntries[exampleIndex];
		const [, codeMod] = exampleCodeEntries[exampleIndex];

		return {
			path: exPath,
			run: (exMod as any).default as Example,
			code: (codeMod as any).default,
		};
	}, [exampleIndex]);

	useEffect(() => {
		const el = document.createElement('div');
		gameRef.current!.appendChild(el);

		const ecs = new ECS();

		function onGameOver() { };

		function onRestart() { };

		const ctx: ExampleContext = { ecs, root: el, onGameOver, onRestart }
		currentExample.run(ctx);

		ecs.init();

		return () => {
			ecs.destroy();
			gameRef.current!.removeChild(el);
		}
	}, [currentExample]);


	return (
		<>
			<div className="flex flex-col gap-4 items-center justify-center p-4">
				<div className="flex gap-4 items-center justify-center">
					<button type="button" onClick={() => exampleIndex$.set(overflowN(exampleIndex$.get() - 1, 0, exampleEntries.length))}>prev</button>
					<div>{currentExample.path}</div>
					<button type="button" onClick={() => exampleIndex$.set(overflowN(exampleIndex$.get() + 1, 0, exampleEntries.length))}>next</button>
				</div>
				<div ref={gameRef} className="game" />
				<pre>
					<code>
						{currentExample.code}
					</code>
				</pre>
			</div>
		</>
	);
}

export default App;
