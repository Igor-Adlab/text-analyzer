FROM timbru31/node-alpine-git:18

RUN mkdir -p /app/node_modules

WORKDIR /app

RUN apk update

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip

RUN apk add zip

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm run start:prod