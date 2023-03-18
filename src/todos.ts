import { writable } from "svelte/store";

export interface TodoItem {
	id: number;
	content: string;
	completed: 0 | 1;
}

export interface TodoList {
	id: number;
	owner: {
		name: string;
	};
	isOwner: boolean;
	title: string;
	todos: TodoItem[];
}

// const todos = writable([
// 	{
// 		id: 1,
// 		owner: { id: 1, name: "John" },
// 		title: "List 1",
// 		todos: [
// 			{ id: 1, content: "Todo 1", completed: true },
// 			{ id: 2, content: "Todo 2", completed: false },
// 			{ id: 3, content: "Todo 3", completed: false }
// 		]
// 	},
// 	{
// 		id: 2,
// 		owner: { id: 2, name: "Anna" },
// 		title: "List 1",
// 		todos: [
// 			{ id: 4, content: "Todo 1", completed: false },
// 			{ id: 5, content: "Todo 2", completed: false },
// 			{ id: 6, content: "Todo 3", completed: false }
// 		]
// 	}
// ] as TodoList[]);

const todos = writable([] as TodoList[]);

async function fetchTodoLists() {
	try {
		const res = await fetch("/api/todolists");
		const data = (await res.json()) as TodoList[];

		todos.set(data);
	} catch (error) {
		console.error(error);
	}
}

async function createTodoList(title: string) {
	const newTodoList: Partial<TodoList> = { title };

	let todoList: TodoList;
	try {
		const res = await fetch("/api/todolists", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newTodoList)
		});
		todoList = (await res.json()) as TodoList;
	} catch (error) {
		console.error(error);
		return;
	}

	todos.update((prev) => [...prev, todoList]);
}

async function createTodo(todolistId: TodoList["id"], content: string) {
	const newTodo = {
		todolistId,
		content
	};

	let todo: TodoItem;
	try {
		const res = await fetch("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newTodo)
		});

		todo = (await res.json()) as TodoItem;
	} catch (error) {
		console.error(error);
		return;
	}

	todos.update((prev) => {
		const todoList = prev.find((todoList) => todoList.id === todolistId);
		if (!todoList) return prev;

		todoList.todos.push(todo);
		return prev;
	});
}

async function toggleTodo(todoId: TodoItem["id"]) {
	let foundTodo: TodoItem;
	try {
		const res = await fetch(`/api/todos`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ todoId })
		});

		foundTodo = (await res.json()) as TodoItem;
	} catch (error) {
		console.error(error);
		return;
	}

	todos.update((prev) => {
		const todoList = prev.find((todoList) => todoList.todos.find((todo) => todo.id === todoId));
		if (!todoList) return prev;

		const todoItem = todoList.todos.find((todo) => todo.id === todoId);
		if (!todoItem) return prev;

		todoItem.completed = foundTodo.completed;
		return prev;
	});
}

async function deleteTodo(todoId: TodoItem["id"]) {
	try {
		const res = await fetch(`/api/todos`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ todoId })
		});
		if (res.status !== 200) return;
	} catch (error) {
		console.error(error);
		return;
	}

	todos.update((prev) => {
		const todoList = prev.find((todoList) => todoList.todos.find((todo) => todo.id === todoId));
		if (!todoList) return prev;

		todoList.todos = todoList.todos.filter((todo) => todo.id !== todoId);
		return prev;
	});
}

const getTodos = todos.subscribe;
export { getTodos, fetchTodoLists, createTodoList, createTodo, toggleTodo, deleteTodo };
