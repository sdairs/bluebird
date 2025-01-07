# Use an official Node.js runtime as a base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
#COPY package*.json ./
#RUN npm install

# Install the Bluebird CLI globally (if needed)
RUN npm install -g @sdairs/bluebird

# Set default environment variables (optional - can be overridden at runtime)
ENV BROKERS=localhost:9092
ENV TOPIC=bluebird
ENV CLIENT_ID=bluebird-producer
ENV SASL_MECHANISM=plain
ENV BATCH_SIZE=921600
ENV USERNAME=""
ENV PASSWORD=""
ENV CURSOR=""
ENV SSL=false
ENV DESTINATION=kafka

# Copy the entrypoint shell script
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh

# Make the shell script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entrypoint to use the entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

