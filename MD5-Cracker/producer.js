#!/usr/bin/env node
/* #author: Spitzer Thomas Manfred, spitzert14, swd14, 06.05.2016
   #subject: Producer that procudes md5 passwords */
"use strict";

// connection parameter
var server = "127.0.0.1";
var port = 5672;
var vhost = "/";
var queue = "passwordqueue";
var username = "spitzert14";
var password = "spitzert14";
var url = "amqp://" + username + ":" + password + "@" + server + ":" + port + vhost;

var amqp = require("amqplib/callback_api");

var passwords = new Array();
        
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('VirusShare_00001.md5.txt')
});

lineReader.on('line', function (line) {
    passwords.push(line);
});        
        
amqp.connect(url, function(err,connection) {
	if (err) {
		console.log(err);
	} else {
		connection.createChannel(function(err, channel){
			channel.assertQueue(queue,{durable:false});
			for(var pass in passwords){
				var msg = {"md5":passwords[pass]};
				channel.sendToQueue(queue, new Buffer(JSON.stringify(msg)));
				console.log("Sending password: [" + passwords[pass] + "]");
			}
		});
	}
});