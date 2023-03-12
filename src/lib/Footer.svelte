<script lang="ts">
	import svelteLogo from "../assets/svelte.svg";
</script>

<footer>
	<a href="https://svelte.dev" target="_blank" class="credit">
		<img src={svelteLogo} alt="Svelte Logo" />
		<p>Made with <br /><span>Svelte</span></p>
	</a>
</footer>

<style lang="sass">
	footer
		display: flex
		justify-content: center

		margin-top: auto
		font-size: 9pt

		a
			width: fit-content
			font-weight: 400
			color: #aaa

		img
			// width: 1rem
			height: 24px
			vertical-align: middle

		.credit
			display: flex
			align-items: center
			text-align: left
			line-height: 9pt
			
			p 
				margin: 0

				& > span
					font-weight: 600
					color: #f83305
</style>
