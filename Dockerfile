FROM node:0.10-onbuild
ADD . /
WORKDIR /
RUN npm install -g subkit-microservice
RUN npm install -g node-static
RUN subkit update service
RUN subkit install service dashboard
RUN subkit run service
EXPOSE 9090
EXPOSE 8080
ENTRYPOINT ["static","-p9090", "-a0.0.0.0", "app"]