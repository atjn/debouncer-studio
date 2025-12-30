<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { sourceCode } from "$lib/state/configuration.ts";

	let editorElement: HTMLElement = $state()!;
	let disposeEditor: (() => void) | undefined;

	onMount(async () => {
		const { setupEditor, disposeEditor: _disposeEditor } = await import(
			"./monacoEditor.ts"
		);
		disposeEditor = _disposeEditor;

		setupEditor(editorElement, sourceCode);
	});
	onDestroy(() => {
		disposeEditor?.();
	});
</script>

<div id="editor" bind:this={editorElement} class="h-screen"></div>

<style>
	#editor {
		margin-left: auto;
		margin-right: auto;
		min-width: 400px;
		max-width: 800px;
		min-height: 500px;
		border-width: 0.1em;
		border-style: solid;
		border-color: var(--border-color);
	}
</style>
