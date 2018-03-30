const http = require('http');
const port = 8080;
const app = require('./app');

http.createServer(app.handleRequest).listen(port);
