import type { PluginDefinition } from "$lib/waterfall/PluginDefinition.ts";
import * as defaultSourceCode from "$lib/defaultSourceCode.ts";

export const pluginsToCode = (plugins: PluginDefinition[]) => {
	let imports = defaultSourceCode.imports;
	if (plugins.length > 0) {
		const pluginIds = new Set(plugins.map((plugin) => plugin.id));
		imports += `\nimport {`;
		for (const id of pluginIds) {
			imports += `\n\t${id},`;
		}
		imports += `\n} from "./debouncer/plugins.ts";`;
	}

	let expression = defaultSourceCode.expression.start;
	for (const plugin of plugins) {
		expression += `\n\tnew ${plugin.id}(`;
		let hasObjectLiteral = false;
		for (const option of plugin.options) {
			if (option.code.value) {
				if (!hasObjectLiteral) {
					hasObjectLiteral = true;
					expression += "{";
				}
				expression += `\n\t\t${option.key}: ${option.code.value},`;
			}
		}
		if (hasObjectLiteral) {
			expression += "\n\t}";
		}
		expression += "),";
	}
	expression += defaultSourceCode.expression.end;

	return `${imports}${defaultSourceCode.separator}${expression}`;
};
