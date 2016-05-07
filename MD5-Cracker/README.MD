# MD5 Passwort-Cracker (dictionary attack) using RabbitMQ
* Author: Thomas Manfred Spitzer

## Requirements
* python3
	> pip3 install pika
* RabbitMQ Server
* NodeJS

Connection parameter are in the header area of each file

## Startup producer
Producer reads all hashes listed in file (VirusShare_00001.md5.txt) and publishes it to queue
> node ./producer.js

## Startup consumer
Consumer consumes the queue and uses a dictionary (dictionary.txt) to crack the password
> python ./consumer.py
