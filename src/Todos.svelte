<script lang="ts">
	import { onMount } from "svelte";

	import { getTodos, fetchTodoLists, toggleTodo, deleteTodo, createTodo, createTodoList } from "./todos";
	import type { TodoList, TodoItem } from "./todos";

	onMount(() => fetchTodoLists());

	let todos: TodoList[];
	getTodos((data) => {
		todos = data;
	});

	function handleCreateTodoList(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const title = form.list_title;

		if (!title.value) return;
		createTodoList(title.value);

		title.value = "";
		createMode = false;
	}
	function handleAddTodo(event: Event, todolistId: TodoList["id"]) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const content = form.content;

		if (!content.value) return;
		createTodo(todolistId, content.value);

		content.value = "";
	}
	function handleToggleTodo(id: TodoItem["id"]) {
		toggleTodo(id);
	}
	function handleDeleteTodo(id: TodoItem["id"]) {
		deleteTodo(id);
	}

	$: getTodos((data) => {
		console.log(data);
	});

	let createMode = false;
</script>

<h1>Todos</h1>

<div class="creator">
	{#if createMode}
		<div class="todo-list">
			<form on:submit={(e) => handleCreateTodoList(e)}>
				<input type="text" name="list_title" placeholder="Enter a title" autocomplete="off" required />
				<input type="submit" value="Create" />
			</form>
		</div>
	{:else}
		<input type="button" class="createList" on:click={() => (createMode = true)} value="Create A Todo List" />
	{/if}
</div>

<div class="scrollable">
	{#each todos as todolist}
		<!-- TODO: have api return "todolist.isOwner" -->
		<div class="todo-list">
			<h2>{todolist.title}</h2>
			<h5>By: {todolist.owner.name}</h5>
			<ul>
				{#each todolist.todos as todo}
					<li>
						<input type="button" disabled={!todolist.isOwner} on:click={() => handleToggleTodo(todo.id)} value={`${todo.completed ? "✔" : "✖"}`} class={`${todo.completed ? "check" : "cross"}`} />
						<span>{todo.content}</span>
						<input type="button" disabled={!todolist.isOwner} on:click={() => handleDeleteTodo(todo.id)} value="️🗑" />
					</li>
				{/each}
			</ul>
			{#if todolist.isOwner}
				<form on:submit={(e) => handleAddTodo(e, todolist.id)}>
					<input type="text" name="content" placeholder="Add a todo..." autocomplete="off" required />
					<input type="submit" value="+" />
				</form>
			{/if}
		</div>
	{/each}
</div>

<style lang="sass">
	.check
		color: #0b0 !important
	.cross
		color: #b00 !important
	input[type="button"], input[type="submit"]
		border: none
		background: none
		font-size: 1.5em
		cursor: pointer
		line-height: 1
	.todo-list
		background: #c7ac4a
		border: 1px solid black
		*
			color: #000
		
		ul
			list-style: none
			padding: 0
			margin: 0 0 1em 0
			li
				display: flex
				flex-direction: row
				justify-content: space-between
		form
			margin-bottom: 2em
			display: flex
			flex-direction: row
			justify-content: center
			gap: 1em
			input[type="submit"]
				
				transition: transform 0.2s
				&:hover
					transform: scale(1.5)
			input[type="text"]
				font-size: 1em
				outline: none
				border: none
				background: none
				border-bottom: 1px dashed black
				padding: 0 0.25em
				margin: 0
				&::placeholder
					color: #000
					font-size: .75em
	.scrollable
		display: flex
		flex-direction: column
		gap: 2rem
		overflow-y: auto
		height: 100%
	.creator
		margin-block: 1em
		form
			display: flex
			flex-direction: column
			gap: 2em
			input[type="text"]
				text-align: center
				font-size: 1.5em
				font-weight: 600
				padding: 0.5em
				&::placeholder
					color: #444
					font-weight: 400
	.createList
		font-size: 1.5em
		font-weight: 600
		padding: 0.5em
		width: 100%
		text-align: center
		background: #c7ac4a
		border: 1px solid black
		color: #646cff
		cursor: pointer
		transition: transform 0.2s
		&:hover
			transform: scale(1.05)
			color: #535bf2
</style>
