FROM node:8
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm i --progress=false && \
    npm run build
EXPOSE 9999
ENTRYPOINT [ "npm","start" ]
