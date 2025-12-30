<script lang="ts">
	import PluginSettings from "./PluginSettings.svelte";
	import { pluginDefinitions } from "./pluginDefinitions.ts";
	import { plugins, sourceCode } from "$lib/state/configuration.ts";

	let requests = $state([{ time: 1000 }, { time: 2000 }, { time: 3000 }]);
	let ratio = $state(50);

	let newPluginId = $state();
	let newPluginIndex = $state(1);
	async function addPlugin() {
		plugins.update((array) => {
			$plugins;
			const newPlugin = pluginDefinitions.find(
				(candidate) => candidate.id === newPluginId,
			);
			if (newPlugin) {
				array.splice(newPluginIndex, 0, newPlugin);
			} else {
				console.error("Could not find plugin from id");
			}
			return array;
		});
	}
	function updatePlugins() {
		$plugins = $plugins;
	}
	$inspect($plugins);
	$inspect($sourceCode);
</script>

<div id="container">
	<form id="plugin-add">
		<label>
			Add plugin
			<select bind:value={newPluginId}>
				{#each pluginDefinitions as { name, id }}
					<option value={id}>{name}</option>
				{/each}
			</select>
		</label>
		<label>
			at index
			<input
				type="number"
				min={1}
				max={$plugins.length}
				step={1}
				bind:value={newPluginIndex}
			/>
		</label>
		<button type="submit" onclick={addPlugin}>Add</button>
	</form>
	<svg id="requests">
		{#each requests as { time }}
			{@const x = time / ratio}
			<!--{#if label}
				<text class="request-label" {x} y={0}>{label}</text>
			{/if}-->
			<line
				class="request-call"
				x1={x}
				x2={x}
				y1={0}
				y2={30}
				marker-end="url(#arrowhead)"
			/>
		{/each}
		<marker
			id="arrowhead"
			viewBox="0 0 15 15"
			refX="10"
			refY="5"
			markerWidth="6"
			markerHeight="6"
			orient="auto-start-reverse"
		>
			<path d="M 5 0 L 15 5 L 5 10 z" />
		</marker>
	</svg>
	{#each $plugins as plugin}
		<PluginSettings definition={plugin} onchange={updatePlugins} />
	{/each}
</div>

<style>
	#container {
		min-width: 400px;
		max-width: 800px;
		margin: 0 50px 50px 50px;
		display: grid;
		grid-template-rows: 100px auto;
		grid-template-columns: 1fr 1fr;
		grid-template-areas:
			"plugins requests"
			"main main";
	}
	#plugin-add {
		grid-area: plugins;
	}
	#requests {
		grid-area: requests;
		--request-color: yellow;
		& .request-call {
			stroke: var(--request-color);
			stroke-width: 2px;
		}
		& #arrowhead {
			fill: var(--request-color);
		}
	}
</style>
