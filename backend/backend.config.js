require('dotenv').config();

module.exports = {
  postgresConnParams: {
    user: process.env.POSTGRES_USER || 'evmostats',
    host: process.env.POSTGRES_HOST || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'evmostats',
    password: process.env.POSTGRES_PASSWORD || 'evmostats',
    port: process.env.POSTGRES_PORT || 5432,
  },
  crawlers: [
    {
      enabled: !process.env.CRAWLER_STATS_DISABLE,
      // eslint-disable-next-line global-require
      module: require('./lib/crawlers/stats'),
      config: {        
        rpc: 'http://localhost:1317/cosmos/staking/v1beta1/validators?pagination.limit=10000',
        startDelay: 5 * 1000, // 5 sec
        pollingTime: 900 * 1000, // 15 min
      },
    },
    {
      enabled: !process.env.CRAWLER_DELEGATIONS_DISABLE,
      // eslint-disable-next-line global-require
      module: require('./lib/crawlers/delegations'),
      config: {        
        rpc: 'http://localhost:1317/cosmos/staking/v1beta1/validators/evmosvaloper1s95dwnw7vuks688tnzuue0hl6gsczmzjlf759z/delegations',
        startDelay: 5 * 1000, // 5 sec
        pollingTime: 43200 * 1000, // 12 h
      },
    },
  ],
};
