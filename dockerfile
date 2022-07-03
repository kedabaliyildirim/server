# Node server
FROM node:12-alpine as node-server
ENV NODE_OPTIONS=--max_old_space_size=8192
WORKDIR /.
COPY . .
RUN npm install --production --silent && mv node_modules ../
CMD ["npm", "start"]
