# Use an official Node.js runtime as a minimal base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install API dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your Express application runs
EXPOSE 3000

# Specify the command to run your API
CMD ["node", "app.js"]