FROM debian:latest

RUN apt-get update && apt-get install -y nodejs npm

COPY src/ /serv

EXPOSE 5000
CMD cd serv && node main.js