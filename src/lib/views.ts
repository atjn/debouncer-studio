import type { SvelteComponent } from "svelte";
import Waterfall from "$lib/waterfall/Waterfall.svelte";
import Editor from "$lib/editor/Editor.svelte";

export const enum Views {
	Waterfall = "waterfall",
	Editor = "editor",
	Size = "size",
	Playground = "playground",
}

export type ViewData<ID> = {
	id: ID;
	name: string;
	component: SvelteComponent;
};

type ViewsData = {
	[key in Views]: ViewData<key>;
};

export const views: ViewsData = {
	[Views.Waterfall]: {
		id: Views.Waterfall,
		name: "Waterfall",
		component: Waterfall,
	},
	[Views.Editor]: {
		id: Views.Editor,
		name: "Editor",
		component: Editor,
	},
	[Views.Size]: {
		id: Views.Size,
		name: "Size",
		component: Waterfall,
	},
	[Views.Playground]: {
		id: Views.Playground,
		name: "Playground",
		component: Waterfall,
	},
};

export function isViewId(candidate: unknown): candidate is Views {
	return Boolean(
		typeof candidate === "string" &&
			Object.values(Views).includes(candidate as Views),
	);
}
