<script lang="ts">
	import type { Request, Track } from "./Timeline.d.ts";
	let {
		requests,
		tracks,
		ratio = 10,
	}: { requests: Request[]; tracks: Track[]; ratio: number } = $props();

	const width = 500;
	const height = 100;

	const topReqMargin = 10;
	const requestY = topReqMargin;
	const requestHeight = 30;
	const reqDebMargin = 11;
	const debouncerY = requestY + requestHeight + reqDebMargin;
	const debActMargin = 9;
	const activationY = debouncerY + debActMargin;
	const activationHeight = 30;
</script>

<svg class="timeline" viewBox="0 0 {width} {height}">
	{#each requests as { label, time }}
		{@const x = time / ratio}
		{#if label}
			<text class="request-label" {x} y={requestY}>{label}</text>
		{/if}
		<line
			class="request-call"
			x1={x}
			x2={x}
			y1={requestY}
			y2={requestY + requestHeight}
			marker-end="url(#arrowhead-request)"
		/>
	{/each}
	<line class="debouncer" x1={0} x2={width} y1={debouncerY} y2={debouncerY} />
	{#each activations as { label, time, duration = 100 }}
		{@const x = time / ratio}
		{#if label}
			<text class="activation-label" {x} y={activationY}>{label}</text>
		{/if}
		<line
			class="activation-call"
			x1={x}
			x2={x}
			y1={activationY}
			y2={activationY + activationHeight}
			marker-end="url(#arrowhead-activation)"
		/>
		<rect
			class="activation-time"
			{x}
			width={duration / ratio}
			y={activationY}
			height={activationHeight + 4}
		/>
	{/each}
	<defs>
		<marker
			id="arrowhead-request"
			viewBox="0 0 15 15"
			refX="10"
			refY="5"
			markerWidth="6"
			markerHeight="6"
			orient="auto-start-reverse"
		>
			<path d="M 5 0 L 15 5 L 5 10 z" />
		</marker>
		<marker
			id="arrowhead-activation"
			viewBox="0 0 15 15"
			refX="10"
			refY="5"
			markerWidth="6"
			markerHeight="6"
			orient="auto-start-reverse"
		>
			<path d="M 5 0 L 15 5 L 5 10 z" />
		</marker>
	</defs>
</svg>

<style>
	.timeline {
		--request-color: yellow;
		--activation-color: red;
		height: 100px;
		width: 500px;

		& .debouncer {
			stroke: blue;
			stroke-width: 10px;
		}
		& .request-call {
			stroke: var(--request-color);
			stroke-width: 2px;
		}
		& .activation-call {
			stroke: var(--activation-color);
			stroke-width: 2px;
		}
		& .activation-time {
			fill: var(--activation-color);
			opacity: 0.2;
		}
		& #arrowhead-request {
			fill: var(--request-color);
		}
		& #arrowhead-activation {
			fill: var(--activation-color);
		}
	}
</style>
