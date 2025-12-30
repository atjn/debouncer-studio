export enum OptionTypes {
	Number,
	Boolean,
}

type DefaultOptions = {
	name: string;
	key: string;
};

type NumberOptions = {
	type: OptionTypes.Number;
	input?: {
		step?: number;
		min?: number;
		max?: number;
	};
	code: {
		value: number | undefined;
	};
};

type BooleanOptions = {
	type: OptionTypes.Boolean;
	code: {
		value: boolean | undefined;
	};
};

export type PluginOptions =
	| (DefaultOptions & NumberOptions)
	| (DefaultOptions & BooleanOptions);

export type PluginDefinition = {
	name: string;
	id: string;
	options: PluginOptions[];
};
