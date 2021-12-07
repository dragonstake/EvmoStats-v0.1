// @ts-check
const pino = require("pino");
const axios = require("axios").default;
const { wait, dbParamInsert, delegatedTokens, availableTokens } = require("../utils.js");

const logger = pino();
const loggerOptions = {
  crawler: "delegations",
};
module.exports = {
  start: async (pool, config) => {
    await wait(config.startDelay);
    logger.info(loggerOptions, "Starting delegations crawler...");
    const startTime = new Date().getTime();
    try {
      const response = await axios.get(config.rpc);
      const delegations = response.data.delegation_responses

      for (const delegation of delegations) {
        await dbParamInsert(
          pool,
          `INSERT INTO delegations (
            delegator_address,
            validator_address,
            amount,
            timestamp
            ) VALUES (
              $1,
              $2,
              $3,
              $4
            )`,
            [
              delegation.delegation.delegator_address,
              delegation.delegation.validator_address,
              delegation.delegation.shares,
              startTime,
            ],
            loggerOptions
        );
        await dbParamInsert(
          pool,
          `INSERT INTO delegators (
            address,
            available,
            delegated,
            unbonding,
            timestamp
            ) VALUES (
              $1,
              $2,
              $3,
              $4,
              $5
            )`,
            [
              delegation.delegation.delegator_address,
              await availableTokens(delegation.delegation.delegator_address),
              await delegatedTokens(delegation.delegation.delegator_address),              
              0,
              startTime,
            ],
            loggerOptions
        );
      }
    } catch (error) {
      logger.error(
        loggerOptions,
        `Error fetching data from RPC: ${JSON.stringify(error)} ${error}`
      );
    }
    const endTime = new Date().getTime();
    logger.info(
      loggerOptions,
      `Executed in ${((endTime - startTime) / 1000).toFixed(0)}s`
    );
    logger.info(
      loggerOptions,
      `Next execution in ${(config.pollingTime / 60000).toFixed(0)}m...`
    );
    setTimeout(() => module.exports.start(pool, config), config.pollingTime);
  },
};
