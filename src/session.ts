let session = {
	id: undefined
};

async function initSession() {
	const cookie = document.cookie.split(";").find((cookie) => cookie.startsWith("idToken="));
	const idToken = Number(cookie?.split("=")[1]);

	session.id = idToken;
}

function getSession() {
	console.log(session);

	return session;
}

export { initSession, getSession };
