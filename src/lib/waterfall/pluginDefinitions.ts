import type { PluginDefinition } from "./PluginDefinition";

export const pluginDefinitions: PluginDefinition[] = Object.values(
	import.meta.glob("./pluginDefinitions/*.ts", {
		eager: true,
		import: "plugin",
	}),
);
