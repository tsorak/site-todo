<script>
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

	console.log("Hello from Svelte!");
</script>

<nav>
	<a href="/">Home</a>
	<a href="/auth">Login/Register</a>
	<a href="/friends">Friends</a>
	<a href="/todos">Todos</a>
</nav>

<main>
	<svelte:component this={page} {params} />
</main>

<style lang="sass">
	nav
		display: flex
		gap: 2rem
</style>
