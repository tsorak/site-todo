import { initSession } from "./session";

async function login(payload: { email: string; password: string }, statusElement: HTMLElement) {
	statusElement.textContent = "Pending...";

	const res = await fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});
	handleAuthStatus(res.status, statusElement);

	// const data = await res.json();
	// console.log(data);

	// return data;
}

async function register(payload: { email: string; password: string; username: string }, statusElement: HTMLElement) {
	statusElement.textContent = "Pending...";

	const res = await fetch("/api/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});
	handleAuthStatus(res.status, statusElement);

	// const data = await res.json();
	// console.log(data);

	// return data;
}

function handleAuthStatus(status: number, element: HTMLElement) {
	switch (status) {
		case 200:
			console.log("Login Successful");
			element.textContent = "Login Successful";
			break;
		case 201:
			console.log("Registration Successful");
			element.textContent = "Registration Successful";
			break;
		case 400:
			console.log("Invalid Input");
			element.textContent = "Invalid Input";
			break;
		case 401:
			console.log("Invalid Credentials");
			element.textContent = "Invalid Credentials";
			break;
		case 409:
			console.log("Email is already in use");
			element.textContent = "Email is already in use";
			break;
		default:
			console.log("Unexpected Error");
			element.textContent = "An unexpected error occured...";
			break;
	}
	if (status < 300 && status >= 200) initSession();
}

export { login, register };
