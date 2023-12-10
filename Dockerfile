# syntax=docker/dockerfile:1

# Use node image for base image for all stages.
FROM node:20.9.0-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Create a stage for installing dependencies.
FROM base as dependencies

# Copy only package.json and package-lock.json to leverage Docker cache.
COPY package*.json ./

# Install production dependencies
RUN npm ci --production

# Create a stage for building the application.
FROM base as build

# Copy all files, including development dependencies.
COPY . .

# Run the build script.
RUN npm run build

# Create a new stage to run the application with minimal runtime dependencies.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Copy the production dependencies and built application.
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
