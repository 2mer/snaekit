export function lerp(min: number, max: number, progress: number) {
	return (max - min) * progress + min;
}
