FROM alpine:3.8

# Install packages
RUN apk add --no-cache nodejs npm

# Create app directory
WORKDIR /usr/src/app

# Set env variables
ENV IP="192.168.0.2"

# Bundle app source
COPY . .

# Install production dependencies
RUN npm ci --only=production

# Expose nginx
EXPOSE 9097

# Run nginx
CMD ["node", "src/index.js"]
