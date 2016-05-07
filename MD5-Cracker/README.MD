# MD5 Passwort-Cracker (dictionary attack) using RabbitMQ
* Author: Thomas Manfred Spitzer

Connection parameter are in the header of each file

## Startup producer
Producer reads all hashes listed in file hashes.txt and set it to queue
> node ./producer.js

## Startup consumer
Consumer uses a dictionary (dictionary.txt) to crack the password
> python ./consumer.py
