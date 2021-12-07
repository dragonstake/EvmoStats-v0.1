# Evmostats (backend)

Rebuild after a change in config file (backend.config.js):

docker-compose -f docker/docker-compose-evmostats.yml build crawler
yarn workspace backend docker
