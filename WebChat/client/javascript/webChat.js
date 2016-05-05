'use strict';
(function () {
    var username = null;
    var ws = null;

    initSocketConnection();

    function toMessage(type, content) {
        return JSON.stringify({
            type: type,
            username: username,
            content: content
        });
    }

    document.getElementById('login').onclick = function () {
        if (username) {
            return;
        }
        initSocketConnection();
        username = document.getElementById('username').value;
        ws.send(toMessage('login'));
    };

    document.getElementById('logout').onclick = function () {
        initSocketConnection();
        if (username) {
            ws.send(toMessage('logout'));
            username = '';
        }
    };

    document.getElementById('send').onclick = function () {
        initSocketConnection();
        if (username) {
            ws.send(toMessage('message', document.getElementById('message').value));
        }
    };

    document.getElementById('sendImage').onclick = function () {
        initSocketConnection();
        if (username) {
            var file = document.getElementById('image').files[0],
                reader = new FileReader();
            reader.onload = function (evt) {
                ws.send(toMessage('image', evt.target.result));

            };
            reader.onerror = function (evt) {
                console.log(evt);
            };

            reader.readAsDataURL(file);

        }
    };

    function getDateAndTime() {
        return new Date().toDateString().concat(' ', new Date().toLocaleTimeString(), ': ');
    }

    function print(message) {
        if (message.type === 'message') {
            document.getElementById('content').innerHTML += '<p>' + getDateAndTime() + message.content + '</p>';
        } else if (message.type === 'image') {
            document.getElementById('content').innerHTML += '<p>' + getDateAndTime() + message.username + '<img src="' + message.content + '"></p>';
        } else {
            document.getElementById('content').innerHTML += '<p>' + getDateAndTime() + message + '</p>';
            console.log('Unsupported message type: ' + message.type);
        }
    }

    function initSocketConnection() {
        if (ws) {
            return;
        }

        ws = new WebSocket('ws://localhost:1337', 'chat-protocol');
        ws.onopen = function () {
            console.log('connected to WebSocketServer!');
        };

        ws.onmessage = function (ev) {
            console.log('< ' + ev.data);
            print(JSON.parse(ev.data));
        };

        ws.onclose = function () {
            print("OnClose: No connection to WebSocketServer!");
            ws = null;
        };

        ws.onerror = function () {
            print("OnError: No connection to WebSocketServer!");
            ws = null;
        };
    }
}());