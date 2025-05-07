@echo off
echo Checking if Redis container is running...

docker ps -q -f name=emumba-redis > nul
if %ERRORLEVEL% == 0 (
    echo Redis container is already running
) else (
    docker ps -aq -f name=emumba-redis > nul
    if %ERRORLEVEL% == 0 (
        echo Starting existing Redis container
        docker start emumba-redis
    ) else (
        echo Creating and starting new Redis container
        docker run --name emumba-redis -p 6379:6379 -d redis:alpine
    )
)

echo Redis is running on port 6379
