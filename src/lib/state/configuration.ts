import type { PluginDefinition } from "$lib/waterfall/PluginDefinition.ts";
import { get, writable, type Writable } from "svelte/store";
import { codeToPlugins } from "./connectors/codeToPlugins";
import { imports, separator, expression } from "$lib/defaultSourceCode.ts";
import { pluginsToCode } from "./connectors/pluginsToCode.ts";

export const sourceCode: Writable<string> = writable(
	`${imports}${separator}${expression.start}${expression.end}`,
);

export const plugins: Writable<PluginDefinition[]> = writable([]);

plugins.subscribe((array) => {
	const newCode = pluginsToCode(array);
	sourceCode.set(newCode);
});

sourceCode.subscribe(async (code) => {
	const newPlugins = codeToPlugins(code, get(plugins));
	if (newPlugins) plugins.set(newPlugins);
});
