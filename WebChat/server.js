'use strict';

var socketServer = require('websocket').server;
var http = require('http');

var connections = [];
var webSocketsServerPort = 1337;

var httpServer = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

httpServer.listen(webSocketsServerPort, function () {
    console.log((new Date()) + ' Server is listening on port ' + webSocketsServerPort);
});

var wsServer = new socketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});


wsServer.on('request', function (request) {
    var connection = request.accept('chat-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');
    connections.push(connection);

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            handleMessage(JSON.parse(message.utf8Data));
        } else if (message.type === 'binary') {
            console.log('Binary message is not supported!');
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + " :: Peer " + connection.remoteAddress + " disconnected.");
    });
});

function handleMessage(messageObject, connection) {
    if (messageObject.type === 'login') {
        broadcast({type: 'message', content: messageObject.username + ' logged in!'});
    } else if (messageObject.type === 'message') {
        broadcast({type: 'message', username: messageObject.username, content: messageObject.username + ': ' + messageObject.content});
    } else if (messageObject.type === 'image') {
        broadcast({
            type: 'image',
            username: messageObject.username,
            content: messageObject.content
        });
    } else if (messageObject.type === 'logout') {
        broadcast({type: 'message', content: messageObject.username + ' logged out!'});
        connections = connections.splice(connections.indexOf(connection), 1);
    }
}

function broadcast(messageObject) {
    for (var i = 0; i < connections.length; i++) {
        connections[i].sendUTF(JSON.stringify(messageObject));
    }
}