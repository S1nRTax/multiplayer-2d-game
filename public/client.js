

const ws = new WebSocket('ws://localhost:6969');


let myId = undefined;

ws.addEventListener("open", (event) => {
	console.log("open event", event);
});


ws.addEventListener("message", event => {
    if(myId === undefined){
	const data = JSON.parse(event.data);
	if(data.kind === "Hello"){
	   myId = data.id;
	   console.log(`My id is: ${myId}`);
	}else{
	   console.log("Received message from server:", data);
	   ws.close();
	}
   }else {
	
   }
});

ws.addEventListener("error", event => {
	console.log("error:", event);
});


