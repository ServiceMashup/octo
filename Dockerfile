FROM node:0.10-onbuild

ADD . /
WORKDIR /

RUN npm install -g forever
RUN npm install -g subkit-microservice@0.2.75
RUN subkit update service
RUN subkit install service dashboard,file

ENTRYPOINT subkit start service