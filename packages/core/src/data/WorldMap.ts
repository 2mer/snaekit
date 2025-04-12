export abstract class WorldMap<TPosition, TTile> {
	abstract get(position: TPosition): TTile;

	abstract set(position: TPosition, value: TTile): void;

	abstract has(position: TPosition): boolean;
}
