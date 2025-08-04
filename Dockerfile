# Use latest Node.js LTS version as base image
FROM node:lts

# Install Chromium and Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable for Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set working directory inside the container
WORKDIR /srv/app

# Copy only package files for better Docker layer caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm install -g typescript rimraf cpy && npm run build

# Expose the application port
EXPOSE 2025

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
