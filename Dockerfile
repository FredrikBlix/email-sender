
FROM node:lts-slim

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to copy both files package.json AND package-lock.json
COPY package*.json ./
# If you are building code for production
# RUN npm install --only=production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

CMD ["npm", "start"]
