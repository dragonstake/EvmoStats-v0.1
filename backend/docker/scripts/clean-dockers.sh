#!/bin/bash
docker stop backend_crawler
docker stop backend_postgres
docker stop backend_graphql

docker rm backend_crawler
docker rm backend_postgres
docker rm backend_graphql

docker rmi crawler:latest

docker volume rm backend_db-data

