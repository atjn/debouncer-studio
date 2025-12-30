<slot />

<style>
	:global(*) {
		box-sizing: border-box;
	}
	:global(:root) {
		color-scheme: light dark;
		--text-color: light-dark(black, rgb(212 212 212));
		--background-color: light-dark(white, rgb(30 30 30));
		--border-color: light-dark(black, rgb(80 80 80));
	}
	@media (prefers-contrast: more) {
		:global(:root) {
			--text-color: light-dark(black, white);
			--background-color: light-dark(white, black);
			--border-color: light-dark(black, white);
		}
	}
	:global(body) {
		color: var(--text-color);
		background-color: var(--background-color);
	}
</style>
