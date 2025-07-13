import { WORLD_WIDTH, WORLD_HEIGHT } from './common.js';

const gameCanvas = document.getElementById('game');
if(gameCanvas == null) throw new Error('No element with id `game`');
gameCanvas.width = WORLD_WIDTH;
gameCanvas.height = WORLD_HEIGHT;
const ctx = gameCanvas.getContext("2d");
if(ctx === null) throw new Error('2d canvas is not supported');

const ws = new WebSocket('ws://localhost:6969');
let myId = undefined;
const players = new Map();

ws.addEventListener("open", (event) => {
    console.log("open event", event);
});

ws.addEventListener("message", event => {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    
    if(myId === undefined){
        if(data.kind === "Hello"){
            myId = data.id;
            console.log(`My id is: ${myId}`);
        } else {
            console.log("Expected Hello message but got:", data);
        }
    } else {
        // Handle subsequent messages
        switch(data.kind) {
            case "PlayerJoined":
                players.set(data.id, {
                    id: data.id,
                    x: data.xPos,
                    y: data.yPos,
                });
                console.log(`Player ${data.id} joined at (${data.xPos}, ${data.yPos})`);
                break;
                
            case "ExistingPlayer":
                players.set(data.id, {
                    id: data.id,
                    x: data.xPos,
                    y: data.yPos,
                });
                console.log(`Existing player ${data.id} at (${data.xPos}, ${data.yPos})`);
                break;
                
            default:
                console.log("Unknown message type:", data);
        }
    }
});

ws.addEventListener("error", event => {
    console.log("error:", event);
});

ws.addEventListener("close", event => {
    console.log("Connection closed:", event);
});
