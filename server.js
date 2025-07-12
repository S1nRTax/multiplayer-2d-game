

const express = require('express'); // to create the web server.
const http = require('http'); // Node.js built-in module for creating HTTP servers.
const path = require('path'); // Node.js built-in module for working with file and directory paths.

const app = express(); // creates an Express application instance
const server = http.createServer(app); // creates an HTTP server, and passing the app to it.

app.use(express.static(path.join(__dirname, 'public'))); // tells the server to server static files from Public directory. 

console.log("Hello from server");

const PORT = 6969; // set a port 
server.listen(PORT, ()=> { // start the server listening on the port.
	console.log(`Server is running at http://localhost:${PORT}`);
	});

