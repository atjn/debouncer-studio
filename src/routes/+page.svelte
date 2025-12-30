<script lang="ts">
	import type { BuildResult } from "esbuild-wasm";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";
	import { activeView } from "$lib/state/activeView.ts";
	import { sourceCode } from "$lib/state/configuration.ts";
	import { views } from "$lib/views.ts";

	let codeBuildResult: Writable<BuildResult> = writable();
	let metaFileHash = $derived(
		btoa(JSON.stringify($codeBuildResult?.metafile || "")),
	);

	let ActiveView = $derived($activeView.component);

	onMount(async () => {
		const { buildCustom } = await import("$lib/esbuild");
		$codeBuildResult = await buildCustom(sourceCode);
		globalThis.result = $codeBuildResult;
	});
</script>

<h1>Debouncer Studio</h1>
<nav>
	{#each Object.entries(views) as [key, data]}
		<button
			onclick={() => {
				$activeView = data;
			}}>{data.name}</button
		>
	{/each}
</nav>
<ActiveView />
<h2>Size</h2>
<a href={`https://esbuild.github.io/analyze#${metaFileHash}`} target="_blank">
	See more details
</a>
<h2>Timing</h2>

<style>
</style>
