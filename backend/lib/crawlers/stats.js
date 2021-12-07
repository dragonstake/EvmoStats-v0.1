// @ts-check
const pino = require("pino");
const axios = require("axios").default;
const { wait, dbParamInsert } = require("../utils.js");

const logger = pino();
const loggerOptions = {
  crawler: "stats",
};
module.exports = {
  start: async (pool, config) => {
    await wait(config.startDelay);
    logger.info(loggerOptions, "Starting stats crawler...");
    const startTime = new Date().getTime();
    try {
      const response = await axios.get(config.rpc);
      const validators = response.data.validators;
      const bonded_validators = validators.filter(
        (validator) => validator.status === "BOND_STATUS_BONDED"
      ).length;
      const unbonded_validators = validators.filter(
        (validator) => validator.status === "BOND_STATUS_UNBONDED"
      ).length;
      const unbonding_validators = validators.filter(
        (validator) => validator.status === "BOND_STATUS_UNBONDING"
      ).length;
      const jailed_validators = validators.filter(
        (validator) => validator.jailed === true
      ).length;
      const total_validators = validators.length;

      const stats = `{
        "status": {
          "total_validators":${total_validators},
          "bonded_validators":${bonded_validators},
          "unbonded_validators":${unbonded_validators},
          "unbonding_validators":${unbonding_validators},
          "jailed_validators":${jailed_validators},
          "validators": ${JSON.stringify(validators)}
        }
      }`;

      await dbParamInsert(
        pool,
        `INSERT INTO stats (
          stats,
          timestamp
        ) VALUES (
          $1,
          $2
        )`,
        [stats, startTime],
        loggerOptions
      );
      // await dbParamInsert(pool,
      //   `INSERT INTO network (
      //     bonded_validators,
      //     unbonded_validators,
      //     unbonding_validators,
      //     jailed_validators,
      //     total_validators,
      //     timestamp
      //   ) VALUES (
      //     $1,
      //     $2,
      //     $3,
      //     $4,
      //     $5,
      //     $6
      //   )`,
      //   [
      //     (validators.filter(validator => validator.status==="BOND_STATUS_BONDED")).length,
      //     (validators.filter(validator => validator.status==="BOND_STATUS_UNBONDED")).length,
      //     (validators.filter(validator => validator.status==="BOND_STATUS_UNBONDING")).length,
      //     (validators.filter(validator => validator.jailed===true)).length,
      //     validators.length,
      //     startTime,
      //   ],
      //   loggerOptions);
      // eslint-disable-next-line no-restricted-syntax
      for (const validator of validators) {
        // eslint-disable-next-line no-await-in-loop
        await dbParamInsert(
          pool,
          `INSERT INTO validator (          
          address,    
          status,
          pubkey,
          moniker,
          tokens,
          delegator_shares,
          unbonding_height,
          timestamp
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8    
        )`,
          [
            validator.operator_address,
            validator.status,
            validator.consensus_pubkey.key,
            validator.description.moniker,
            validator.tokens,
            validator.delegator_shares,
            validator.unbonding_height,
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
