import { writable } from "svelte/store";

//TODO: Convert to async functions

export interface Friend {
	id: number;
	name: string;
	status: string;
	isInitiator: boolean;
}

const friends = writable([] as Friend[]);

async function fetchFriends() {
	try {
		const res = await fetch("/api/friends");
		const data = (await res.json()) as Friend[];

		friends.set(data);
	} catch (error) {
		console.error(error);
	}
}

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

			return res.json();
		})
		.then((data: Friend | { error: string }) => {
			if ("error" in data) return;

			friends.update((prev) => [...prev, data]);
		});
}

function acceptFriend(id: number) {
	fetch(`/api/friends`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ id })
	})
		.then((res) => {
			if (res.status !== 200) return { error: "Something went wrong" };

			return res.json();
		})
		.then((data: Friend | { error: string }) => {
			if ("error" in data) return;

			friends.update((prev) => {
				const pendingRequest = prev.find((friend) => friend.id === id);
				if (!pendingRequest) return [...prev, data];

				pendingRequest.status = "accepted";
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
export { getFriends, addFriend, acceptFriend, removeFriend, fetchFriends };
