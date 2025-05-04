# Use latest Node.js LTS version
FROM node:lts

# Set working directory inside the container
WORKDIR /srv/app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app source
COPY . .

# Build the app
RUN npm install -g typescript rimraf cpy && npm run build

# Expose your API port
EXPOSE 2025

# Start the app in production
CMD ["npm", "run", "start:prod"]
