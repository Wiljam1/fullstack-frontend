# syntax=docker/dockerfile:1

# Use node image for base image for all stages.
FROM node:20.9.0-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json to leverage Docker cache.
COPY package*.json ./

# Install production dependencies, including react-scripts.
RUN npm ci --production

# Copy all source files to the working directory.
COPY . .

# Run the build script.
RUN npm run build

# Create a new stage to run the application with minimal runtime dependencies.
FROM node:20.9.0-alpine as final

# Set working directory for the final stage.
WORKDIR /usr/src/app

# Use production node environment by default.
ENV NODE_ENV production

# Copy only necessary files from the previous stage.
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/build ./build

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
