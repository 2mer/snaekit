export type Example =
	| ((root: HTMLDivElement) => void)
	| ((root: HTMLDivElement) => () => void);
export function Example(e: Example) {
	return e;
}
