FROM debian:latest

RUN apt-get update && apt-get install -y nodejs npm wget

# download postgres
RUN apt-get install -y postgresql postgresql-contrib

# update node
RUN npm install -g n
RUN n stable

# update npm
RUN npm i npm@latest -g

COPY src/ /serv

RUN cd serv && npm install

EXPOSE 5000
CMD service postgresql start && cd serv && npm run start