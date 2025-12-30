import { writable, type Writable } from "svelte/store";

export type CSSQueries = {
	prefersDark: boolean;
	prefersContrast: boolean;
};

const cssQueries: Writable<CSSQueries> = writable({
	prefersDark: false,
	prefersContrast: false,
});

const darkMatch = matchMedia("(prefers-color-scheme: dark)");
darkMatch.addEventListener("change", (event) => {
	cssQueries.update((queries) => {
		queries.prefersDark = event.matches;
		return queries;
	});
});
cssQueries.update((queries) => {
	queries.prefersDark = darkMatch.matches;
	return queries;
});

const contrastMatch = matchMedia("(prefers-contrast: more)");
contrastMatch.addEventListener("change", (event) => {
	cssQueries.update((queries) => {
		queries.prefersContrast = event.matches;
		return queries;
	});
});
cssQueries.update((queries) => {
	queries.prefersContrast = contrastMatch.matches;
	return queries;
});

export { cssQueries };
