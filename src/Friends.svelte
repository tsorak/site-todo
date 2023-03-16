<script lang="ts">
	import router from "page";
	import { onMount } from "svelte";

	import { type Friend, getFriends, removeFriend, addFriend, fetchFriends, acceptFriend } from "./friends";

	onMount(() => fetchFriends());

	let friends: Friend[];

	getFriends((data) => {
		friends = data;
	});

	function handleAddFriendSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get("username") as string;

		addFriend(name);

		form.username.value = "";
	}

	function handleFriendRemoval(event: Event, friendID: number) {
		const button = event.target as HTMLButtonElement;
		button.disabled = true;

		removeFriend(friendID);
	}

	function handleFriendAccept(event: Event, friendID: number) {
		const button = event.target as HTMLButtonElement;
		button.disabled = true;

		acceptFriend(friendID);
	}
</script>

<h1>Friends</h1>

<form on:submit={handleAddFriendSubmit}>
	<input type="text" name="username" placeholder="Friends name" autocomplete="off" />
	<input type="submit" value="Add Friend" />
</form>

<section>
	<h2>My Friends</h2>
	<ul>
		{#each friends as friend}
			<li class={!friend.request.isAccepted ? "pending-friend" : ""}>
				{friend.name}
				<div>
					{#if !friend.request.isAccepted && !friend.request.isSender}
						<button class="accept-friend" on:click={(e) => handleFriendAccept(e, friend.id)}>Accept</button>
					{/if}
					<button class="remove-friend" on:click={(e) => handleFriendRemoval(e, friend.id)}>Remove</button>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style lang="sass">
    .pending-friend
        border-color: #cc0

    .accept-friend:hover
        border-color: #0c0
        color: #0c0

    .remove-friend:hover
        border-color: #c00
        color: #c00

    ul
        list-style: none
        padding: 0
        margin: 0

        li
            padding: 0.5rem 0.5rem 0.5rem 1rem
            border: 1px solid #ccc
            border-radius: 0.5rem
            margin-bottom: 1rem
            display: flex
            justify-content: space-between
            align-items: center

            button
                padding: 0.5rem 1rem
                border: 1px solid #1a1a1a
                border-radius: 0.5rem
                // background-color: #ccc
                // color: #fff
                outline: none
                cursor: pointer

                &:disabled
                    color: #999 !important
                    border-color: #1a1a1a !important
                    cursor: not-allowed
</style>
