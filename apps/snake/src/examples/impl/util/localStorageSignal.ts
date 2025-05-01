import { signal } from "@sgty/sigma";

export function localStorageSignal<T>(key: string, defaultValue: T) {
	let _defaultValue = defaultValue;

	const localStorageValue = localStorage.getItem(key);
	if (localStorageValue) {
		_defaultValue = JSON.parse(localStorageValue);
	}

	const sig = signal<T>(_defaultValue);

	sig.sub((v) => {
		localStorage.setItem(key, JSON.stringify(v));
	});

	return sig;
}
