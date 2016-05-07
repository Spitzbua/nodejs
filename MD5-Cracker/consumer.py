#!/usr/bin/env python3
#author: Spitzer Thomas Manfred, spitzert14, swd14, 06.05.2016
#subject: Consumer that tries to crack passwords with dictionary attack
import pika;
import json;
import hashlib;

#rappidmq server
server = "127.0.0.1";
port = 5672;
vhost = "/";
queue = "passwordqueue";
username = "spitzert14";
password = "spitzert14";

credentials = pika.PlainCredentials(username, password);
config = pika.ConnectionParameters(server, port, vhost, credentials);

connection = pika.BlockingConnection(config);
channel = connection.channel();
channel.queue_declare(queue=queue);

passwords = [];
file = open("dictionary.txt");
for line in file.readlines():
    passwords.append(line.strip());

def startDictionaryAttack(channel,method,properties, body):
    incomingMessage = json.loads(body.decode());
    hash = incomingMessage["md5"];
    print("Incoming password: [{}]".format(hash));
    for password in passwords:
        m = hashlib.md5();
        data = password.encode("utf-8");
        m.update(data);
        out = m.hexdigest();
        if out == hash:
            print("Password for hash [{}] found: [{}]".format(hash,password));
            return;

    print("No password found for hash [{}] in dictionary".format(hash));

channel.basic_qos(prefetch_count=1);
channel.basic_consume(startDictionaryAttack, queue=queue, no_ack=True);
channel.start_consuming();