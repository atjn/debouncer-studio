export type Request = {
	label?: string;
	time: number;
};

export type Activation = {
	label?: string;
	time: number;
	earliest?: number;
	latest?: number;
};

export type Option = {
	label: string;
	start: string;
	end: string;
};

export type Track = {
	activation: Activation[];
	options: Option[];
};
