#!/bin/bash

# Check if Redis container is already running
if [ "$(docker ps -q -f name=emumba-redis)" ]; then
    echo "Redis container is already running"
else
    # Check if the container exists but is stopped
    if [ "$(docker ps -aq -f name=emumba-redis)" ]; then
        echo "Starting existing Redis container"
        docker start emumba-redis
    else
        echo "Creating and starting new Redis container"
        docker run --name emumba-redis -p 6379:6379 -d redis:alpine
    fi
fi

echo "Redis is running on port 6379"
