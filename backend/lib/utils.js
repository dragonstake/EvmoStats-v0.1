// @ts-check
const pino = require("pino");
const axios = require("axios").default;
require("dotenv").config();

const logger = pino();

module.exports = {
  formatNumber: (number) =>
    number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
  wait: async (ms) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    }),
  dbQuery: async (pool, sql, loggerOptions) => {
    try {
      await pool.query(sql);
    } catch (error) {
      logger.error(
        loggerOptions,
        `SQL: ${sql} Error: ${JSON.stringify(error)}`
      );
    }
  },
  dbParamInsert: async (pool, sql, data, loggerOptions) => {
    try {
      await pool.query(sql, data);
    } catch (error) {
      logger.error(
        loggerOptions,
        `SQL: ${sql} Error: ${JSON.stringify(error)}`
      );
    }
  },
  delegatedTokens: async (address) => {
    const endpoint = "http://localhost:1317/cosmos/staking/v1beta1/delegations/" + address;

    const response = await axios.get(endpoint);

    const delegations = response.data.delegation_responses;
    return delegations.reduce((a, b) => a + b.delegation.shares, 0);
  },
  availableTokens: async (address) => {
    const endpoint ="http://localhost:1317/cosmos/bank/v1beta1/balances/" + address;

    const response = await axios.get(endpoint);
    return response.data.balances[0].amount;
  },
  // unbondingTokens: async (address) => {
  //   const endpoint = `http://3.8.131.4:8080/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`

  //   const response = await axios.get(endpoint);
  //   return response.data.unbonding_responses[0].amount
  // },
};
