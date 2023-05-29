# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the workdir
COPY package*.json ./

# Install all the dependencies
RUN npm install

# Copy all local files into the image
COPY . .

# TypeScript projects also need to be built
RUN npm run prepare

# Set the command to run your app (using the command that you use to start your app)
CMD ["npm", "run", "dev"]

# Expose the port the app runs in
EXPOSE 8080