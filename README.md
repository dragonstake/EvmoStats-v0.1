# Evmostats

Evmos blockchain long term stats


## Install

### Prepare

Ubuntu 20.04
```bash
curl -L "https://github.com/docker/compose/releases/download/v2.1.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
apt install apt-transport-https ca-certificates curl software-properties-common build-essential
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt install docker-ce
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt install yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install v14.16
```

Install mono-repo:

```bash
git clone https://github.com/dragonstake/evmostats.git
cd evmostats
yarn
```

### Backend

You will need `nodejs`, `docker` and `docker-compose`:

```bash
yarn workspace backend docker
```

That will build and start all the required dockers:

- PostgreSQL
- Hasura GraphQL server
- Nodejs crawler

You can access Hasura console at `http://server_ip_address:8082`, track the new tables and you will be able to query the data using GraphQL.

### Reset Backend

```bash
yarn workspace backend docker:clean
yarn workspace backend docker
```

enable console in docker-compose, rebuild docker grapql-engine, track all tables, disable console and rebuild graphql-engine

```bash
yarn workspace backend docker:rebuild:graphql
```

### Frontend

```bash
# serve with hot reload at localhost:3000
$ yarn workspace frontend dev

# build for production and launch server
$ yarn workspace frontend build
$ yarn workspace frontend start

# generate static project
$ yarn workspace frontend generate
```
