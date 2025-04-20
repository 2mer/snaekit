import { useEffect, useMemo, useRef, useState } from "react";
import type { Example } from "./util/Example";

const examples = import.meta.glob("./examples/*", { eager: true });
const exampleEntries = Object.entries(examples);

function App() {
	const gameRef = useRef<HTMLDivElement>(null);

	const [exampleIndex, setExampleIndex] = useState(0);

	const currentExample = useMemo(() => {
		const [exPath, exMod] = exampleEntries[exampleIndex];

		return {
			path: exPath,
			run: (exMod as any).default as Example,
		};
	}, [exampleIndex]);

	useEffect(() => {
		return currentExample.run(gameRef.current!);
	}, [currentExample]);

	return (
		<>
			<div ref={gameRef} className="game" />
		</>
	);
}

export default App;
