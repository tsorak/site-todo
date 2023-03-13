import { writable } from "svelte/store";

export interface Friend {
	id: number;
	name: string;
	request: {
		sender: number;
		isPending: boolean;
	};
}

const friends = writable([] as Friend[]);

async function fetchFriends() {
	try {
		const res = await fetch("/api/friends");
		const data = await res.json();
		friends.set(data);
	} catch (error) {
		console.error(error);
		friends.set([{ id: 1, name: "John", request: { sender: 1, isPending: false } }]);
	}
}

// friends.update((prev) => [...prev, { id: 1, name: "John", request: { sender: 1, isPending: false } }]);
// friends.update((prev) => [...prev, { id: 2, name: "Joane", request: { sender: 0, isPending: true } }]);
// friends.update((prev) => [...prev, { id: 3, name: "Elon", request: { sender: 3, isPending: true } }]);

function addFriend(username: string) {
	fetch(`/api/friends`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username })
	})
		.then((res) => {
			if (res.status !== 200) return { error: "Something went wrong" };

			return { id: 3, name: "Elon", request: { sender: 3, isPending: true } };
		})
		.then((data: Friend | { error: string }) => {
			if ("error" in data) return;

			friends.update((prev) => {
				const pendingRequest = prev.find((friend) => friend.name === username);
				if (!pendingRequest) return [...prev, data];

				pendingRequest.request.isPending = false;
				return prev;
			});
		});
}

function removeFriend(id: number) {
	fetch(`/api/friends`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id })
	}).then((res) => {
		if (res.status !== 200) return;
		friends.update((prev) => {
			return prev.filter((friend) => friend.id !== id);
		});
	});
}

const getFriends = friends.subscribe;
export { getFriends, addFriend, removeFriend, fetchFriends };
