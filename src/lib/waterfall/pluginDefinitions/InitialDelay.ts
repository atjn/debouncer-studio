import { OptionTypes, type PluginDefinition } from "../PluginDefinition.ts";
export const plugin: PluginDefinition = {
	name: "Initial delay",
	id: "InitialDelay",
	options: [
		{
			name: "Minimum delay",
			key: "minDelay",
			type: OptionTypes.Number,
			input: {
				step: 50,
				min: 0,
			},
			code: {
				value: undefined,
			},
		},
		{
			name: "Maximum delay",
			key: "maxDelay",
			type: OptionTypes.Number,
			input: {
				step: 50,
				min: 0,
			},
			code: {
				value: undefined,
			},
		},
	],
};
