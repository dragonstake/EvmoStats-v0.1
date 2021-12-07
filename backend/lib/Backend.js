// @ts-check
const pino = require('pino');
const { Pool } = require('pg');
const { wait } = require('./utils.js');

const logger = pino();

class Backend {
  constructor(config) {
    this.config = config;
    this.nodeisSyncing = true;
  }
  async runCrawlers() {
    logger.info('Starting backend, waiting 15s...');
    await wait(15000);
    const pool = await this.getPool();
    logger.info('Running crawlers');

    this.config.crawlers
      .filter((crawler) => crawler.enabled)
      .forEach(
        (crawler) => crawler.module.start(
          pool,
          crawler.config
        ));
  }
  async getPool() {
    const pool = new Pool(this.config.postgresConnParams);
    await pool.connect();
    return pool;
  }
}

module.exports = Backend;
