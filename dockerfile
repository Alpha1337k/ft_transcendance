FROM node:16.10

COPY src/ /serv

RUN cd serv && npm install -v

EXPOSE 5000
CMD cd serv && npm run start
