export const debouncerImports = import.meta.glob("./debouncer/**/*.ts", {
	query: "?raw",
	eager: true,
	import: "default",
});
