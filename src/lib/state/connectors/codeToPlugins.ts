import ts from "typescript";
import {
	OptionTypes,
	type PluginDefinition,
} from "$lib/waterfall/PluginDefinition.ts";
import { pluginDefinitions } from "$lib/waterfall/pluginDefinitions.ts";

export const codeToPlugins = (code: string, plugins: PluginDefinition[]) => {
	const sourceFile = ts.createSourceFile(
		"index.ts",
		code,
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.TS,
	);

	let exportAssignment = ts.forEachChild(sourceFile, (node) => {
		if (ts.isExportAssignment(node)) {
			return node;
		}
	});
	if (
		!exportAssignment?.expression ||
		!ts.isNewExpression(exportAssignment.expression) ||
		!exportAssignment.expression.expression ||
		!ts.isIdentifier(exportAssignment.expression.expression) ||
		exportAssignment.expression.expression.getText(sourceFile) !==
			"Debouncer" ||
		!exportAssignment.expression.arguments?.[1] ||
		!ts.isArrayLiteralExpression(exportAssignment.expression.arguments?.[1])
	) {
		return;
	}
	const pluginsExpression = exportAssignment.expression.arguments[1];

	plugins.length = pluginsExpression.elements.length;
	for (const [index, pluginNode] of pluginsExpression.elements.entries()) {
		if (
			!pluginNode ||
			!ts.isNewExpression(pluginNode) ||
			!pluginNode.expression ||
			!ts.isIdentifier(pluginNode.expression)
		) {
			break;
		}
		const codeId = pluginNode.expression.getText(sourceFile);
		if (plugins[index]?.id !== codeId) {
			const newPlugin = pluginDefinitions.find(
				(candidate) => candidate.id === codeId,
			);
			if (!newPlugin) {
				break;
			}
			plugins[index] = newPlugin;
		}
		const plugin = plugins[index];
		const pluginArgument = pluginNode.arguments?.[0];
		if (!pluginArgument || !ts.isObjectLiteralExpression(pluginArgument)) {
			continue;
		}
		const propertyAssignments = pluginArgument.properties.filter(
			ts.isPropertyAssignment,
		);
		for (const option of plugin.options) {
			const assignment = propertyAssignments.find(
				(candidate) =>
					candidate.name.getText(sourceFile) === option.key,
			);
			if (assignment) {
				const value = assignment.initializer.getText(sourceFile);
				switch (option.type) {
					case OptionTypes.Number: {
						option.code.value = Number(value);
						break;
					}
					case OptionTypes.Boolean: {
						option.code.value = Boolean(value);
						break;
					}
					default: {
						throw new Error("Unknown type");
					}
				}
			} else {
				option.code.value = undefined;
			}
		}
	}

	return plugins;
};
