import { WORLD_WIDTH, WORLD_HEIGHT } from './common.js';
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

app.use(express.static(join(__dirname, 'public'))); // tells the server to server static files from Public directory. 

// this gonna map players with socket  =>   player <=> socket
const players = new Map();
let idCounter = 0;

// this is the connection handlers
wss.on('connection', ws => { // so this will listen for new WebSocket connections, when someones connects via ws it runs this fnc
	// here i just create the actual player.
	const id = idCounter++;
	const player = {
		id,
		xPos: Math.random()*WORLD_WIDTH,
		yPos: Math.random()*WORLD_HEIGHT,
	}
	players.set(ws, player);
	console.log(`Player ${id} connected!`);
	ws.send(JSON.stringify({
		kind: "Hello",
		id,
	}));
 


    // Handle individual client disconnection
    ws.on('close', () => {
        players.delete(id); // remove the player from the map
        console.log(`Player ${id} disconnected`);
    });
});

const PORT = 6969; // set a port 
server.listen(PORT, () => { // start the server listening on the port.
    console.log(`Server is running at http://localhost:${PORT}`);
});
