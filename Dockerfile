# Use an official node runtime as a base image
FROM node:6.9
#FROM ubuntu

# Define environment variable
ENV APP=/opt/ngl

# Set the working directory to /app
WORKDIR $APP

ADD package.json $APP

# Install any needed packages specified in packages.json
RUN npm install

VOLUME $APP/node_modules

# Run app.py when the container launches
CMD npm run-script watch

