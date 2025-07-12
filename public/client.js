

const ws = new WebSocket('ws://localhost:6969');


ws.addEventListener("open", (event) => {
	console.log("open event", event);
});
