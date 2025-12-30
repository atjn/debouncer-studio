<script lang="ts">
	import type { FormEventHandler } from "svelte/elements";

	//import type { Timeline as Timelinetype } from "$lib/timeline/Timeline.d.ts";
	import { OptionTypes, type PluginDefinition } from "./PluginDefinition";
	//import Timeline from "$lib/timeline/Timeline.svelte";

	let {
		definition,
		onchange,
	}: {
		definition: PluginDefinition;
		onchange?: FormEventHandler<HTMLFieldSetElement>;
	} = $props();

	// const timeline: Timelinetype = {
	// 	requests: [{ time: 1000 }, { time: 2000 }, { time: 3000 }],
	// 	activations: [{ time: 2500 }],
	// };
</script>

<fieldset {onchange}>
	<legend>{definition.name}</legend>
	<div class="options">
		{#each definition.options as option}
			<label>
				{option.name}
				{#if option.type === OptionTypes.Number}
					<input
						type="number"
						bind:value={option.code.value}
						step={option.input?.step}
						min={option.input?.min}
						max={option.input?.max}
					/>
				{:else if option.type === OptionTypes.Boolean}
					<input type="checkbox" bind:checked={option.code.value} />
				{/if}
			</label>
		{/each}
	</div>
	<!--Timeline {timeline} />-->
</fieldset>

<style>
	fieldset {
		display: flex;
		border-width: 0.1em;
		border-style: solid;
		border-color: var(--border-color);
	}
	fieldset > .options > * {
		display: block;
	}
</style>
