# Evmostats

Evmos blockchain long term stats


## Install

### Prepare

Ubuntu 20.04

Install nvm: [https://github.com/nvm-sh/nvm#installing-and-updating](https://github.com/nvm-sh/nvm#installing-and-updating)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Run

```bash
source ~/.bashrc
```

Install node v14.16: [https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/](https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/)

```bash
nvm install v14.16
```

Install yarn: [https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)

```bash
npm install --global yarn
```

Install docker [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/)

```bash
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Check docker installation

```bash
sudo docker run hello-world
```

Manage Docker as a non-root user [https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

Verify that you can run docker commands without sudo.

```bash
docker run hello-world
```

Install docker-compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Check docker-compose installation

```bash
docker-compose --version
```

Install libpq-dev, make, gcc and g++

```bash
sudo apt install make gcc g++ libpq-dev
```
Install mono-repo:

```bash
git clone https://github.com/dragonstake/evmostats.git
cd evmostats
yarn
```

### RPCs and passwords

You'll need to configure your own RPCs endpoints in following files: backend/backend.config.js, backend/lib/utils.js and frontend/nuxt.config.js.

Evmostats uses Cosmos SDK REST Server, you'll have to enable it in your evmos node configuration. https://docs.cosmos.network/master/core/grpc_rest.html#rest-server

If you're not serving evmostats from a evmos node, you'll need to configure a reverse proxy for your RPCs and APIs in order to avoid CORS problems. Evmostas uses Keybase API to retrieve some validators info: https://keybase.io/docs/api/1.0

In addition, you may want to change Hasura password, located in backend/docker/docker-compose-evmostats.yml.

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
