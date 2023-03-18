<script lang="ts">
	import Footer from "./lib/Footer.svelte";

	import { initSession } from "./session";
	initSession();

	import router from "page";
	import routes from "./routes";

	let page = null;
	let params = {};
	let user = true;

	routes.forEach((route) => {
		router(
			route.path,
			(ctx, next) => {
				params = { ...ctx.params };
				next();
			},
			() => {
				if (route.auth && !user) {
					router.redirect("/");
				} else {
					page = route.component;
				}
			}
		);
	});

	router.start();

	const redirectedToPage: string | null = new URLSearchParams(location.search).get("page");
	if (redirectedToPage) router.replace("/" + redirectedToPage);
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/auth">Login/Register</a>
		<a href="/friends">Friends</a>
		<a href="/todos">Todos</a>
	</nav>
</header>

<main>
	<svelte:component this={page} {params} />
</main>

<Footer />

<style lang="sass">
	nav
		display: flex
		gap: 2rem
		justify-content: center
	main
		display: flex
		flex-direction: column
		flex-grow: 1
		margin-bottom: 1rem
		height: 0
</style>
