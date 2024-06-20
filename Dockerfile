# Use an official Node 14 slim image from the Docker registry
FROM node:18-slim

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies in the Docker container
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port 3000 on the container
EXPOSE 3200

# Define the command to run your app using CMD
CMD ["node", "app.js"]
