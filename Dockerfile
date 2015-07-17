FROM node:0.10-onbuild
ADD . /
WORKDIR /
RU npm install -g forever
RUN npm install -g subkit-microservice
RUN subkit update service
RUN subkit install service dashboard,file

ENTRYPOINT ["subkit", "run", "service"]