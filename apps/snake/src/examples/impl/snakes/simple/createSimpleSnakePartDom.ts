export function createSimpleSnakePartDom() {
	const container = document.createElement("div");
	const content = document.createElement("div");
	const shadow = document.createElement("div");
	const fallback = document.createElement("div");

	container.appendChild(shadow);
	container.appendChild(content);
	container.appendChild(fallback);

	container.classList.add("container");
	content.classList.add("content");
	shadow.classList.add("shadow");
	fallback.classList.add("fallback");

	return container;
}
