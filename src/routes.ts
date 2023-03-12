import Home from "./Home.svelte";
import Auth from "./Auth.svelte";
import Friends from "./Friends.svelte";
import Todos from "./Todos.svelte";

export default [
	{
		path: "/",
		component: Home
	},
	{
		path: "/auth",
		component: Auth
	},
	{
		path: "/friends",
		component: Friends,
		auth: true
	},
	{
		path: "/todos",
		component: Todos,
		auth: true
	}
] as { path: string; component: any; auth?: boolean }[];
