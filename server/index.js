const config = require('config');
const http = require('http')
const app = require('./app')
const server = http.createServer(app)

server.listen(process.env.PORT || config.get('app.webServer.port'))