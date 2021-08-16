FROM debian:latest

RUN apt-get update && apt-get install -y nodejs npm

RUN npm i npm@latest -g

COPY serv/ /serv

RUN cd serv && npm install

EXPOSE 5000
CMD cd serv && npm run start