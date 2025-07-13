
import { WORLD_WIDTH, WORLD_HEIGHT } from './public/common.js';
import express from 'express'; // to create the web server.
import { createServer } from 'http'; // Node.js built-in module for creating HTTP servers.
import { join, dirname } from 'path'; // Node.js built-in module for working with file and directory paths.
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws'; // imports the WebSocket library.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // creates an Express application instance
const server = createServer(app); // creates an HTTP server, and passing the app to it.
const wss = new WebSocketServer({ server }); // here we create a web socket server on my existing HTTP server, so using the same port.

const SERVER_FPS = 30;
let eventQueue = [];

app.use(express.static(join(__dirname, 'public'))); // tells the server to server static files from Public directory. 

// this gonna map players with socket  =>   player <=> socket
const players = new Map();
let idCounter = 0;

// this is the connection handlers
wss.on('connection', ws => { // so this will listen for new WebSocket connections, when someones connects via ws it runs this fnc
	// here i just create the actual player.
	const id = idCounter++;
	const xPos = Math.random()*WORLD_WIDTH;
	const yPos = Math.random()*WORLD_HEIGHT;
	const player = {
		ws,
		id,
		xPos,
		yPos,
	}
    players.set(id, player);
	console.log(`Player ${id} connected!`);
    eventQueue.push({
        kind: 'PlayerJoined',
        id,
        xPos,
        yPos,
    });   

    // Handle individual client disconnection
    ws.on('close', () => {
        players.delete(id); // remove the player from the map
        console.log(`Player ${id} disconnected`);
    });
});

function tick(){
    for(let event of eventQueue){
        switch(event.kind){
            case 'PlayerJoined':
                const joinedPlayer = players.get(event.id);
                if(joinedPlayer === undefined) continue;
                
                // Send "Hello" message to the joined player
                joinedPlayer.ws.send(JSON.stringify({
                    kind: "Hello",
                    id: joinedPlayer.id,
                }));
                
                // Send info about all existing players to the new player
                players.forEach((otherPlayer) => {
                    if(otherPlayer.id !== joinedPlayer.id){
                        joinedPlayer.ws.send(JSON.stringify({
                            kind: 'ExistingPlayer',
                            id: otherPlayer.id,
                            xPos: otherPlayer.xPos,
                            yPos: otherPlayer.yPos,
                        }));
                    }
                });
                
                // Send info about the new player to all existing players
                const eventString = JSON.stringify(event);
                players.forEach((otherPlayer) => {
                    if(otherPlayer.id !== joinedPlayer.id){
                        otherPlayer.ws.send(eventString);
                    }
                });
                break;
        }
    }
    eventQueue.length = 0;
    setTimeout(tick, 1000/SERVER_FPS);	
}

setTimeout(tick, 1000/SERVER_FPS);

const PORT = 6969; // set a port 
server.listen(PORT, () => { // start the server listening on the port.
    console.log(`Server is running at http://localhost:${PORT}`);
});
