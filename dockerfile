#	* -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-
#	*         _                                 _                      +\
#	 -       | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +
#	+       |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*
#	*      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         +
#	-       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *
#	*       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-
#	-*      Robijn van Houts |   rvan-hou    |   robijnvh             -+
#	*/        Jonas Bolt     |   jbennink    |   JonasDBB               /-
#	/       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *
#	+       Rene Braaksma    |   rbraaksm    |                         -
#	*.                                                                ._
#	-* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *

FROM debian:latest

RUN apt-get update && apt-get install -y nodejs npm curl

# download postgres and setup
RUN apt-get install -y postgresql postgresql-contrib

RUN service postgresql start && \ 
	su postgres --command="printf \"\\set AUTOCOMMIT on\nALTER USER postgres PASSWORD 'codam'; CREATE DATABASE test\n\" | psql"

# update node
RUN npm install -g n
RUN n stable

# update npm
RUN npm i npm@latest -g

COPY src/ /serv

RUN cd serv && npm install

EXPOSE 5000
CMD service postgresql start && cd serv && npm run start