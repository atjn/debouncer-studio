import { goto } from "$app/navigation";
import { writable, type Writable } from "svelte/store";
import { Views, views, isViewId, type ViewData } from "$lib/views.ts";

const defaultView: Views = Views.Waterfall;
const urlParamKey: string = "view";

let initialView: ViewData<Views>;

if ("location" in globalThis) {
	const params = new URLSearchParams(globalThis.location.search);
	const viewId = params.get(urlParamKey);
	if (isViewId(viewId)) {
		initialView = views[viewId];
	}
}

initialView ||= views[defaultView];

export const activeView: Writable<ViewData<Views>> = writable(initialView);

if ("location" in globalThis && "history" in globalThis) {
	activeView.subscribe((view) => {
		const url = new URL(globalThis.location.href);
		url.searchParams.set(urlParamKey, view.id);
		goto(url, { replaceState: true });
	});
}
