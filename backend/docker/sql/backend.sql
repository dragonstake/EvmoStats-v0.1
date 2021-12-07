GRANT ALL PRIVILEGES ON DATABASE evmostats TO evmostats;


CREATE TABLE IF NOT EXISTS stats (  
  stats JSONB NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( timestamp )
);

--  {
--    "top": "36",
--    "address": "kira1dkrc826nutstpt0llcwleuvqq78hpvq0z5fjv4",
--    "valkey": "kiravaloper1dkrc826nutstpt0llcwleuvqq78hpvq03j435e",
--    "pubkey": "kiravalconspub1zcjduepqz3qedtkfedrwexjw68vvn8euvqegewsrkgdru4j35cy654jq097svt576j",
--    "proposer": "5F5FDB1132DE42D54BF80A953F161891959B3DE0",
--    "moniker": "elite128",
--    "status": "ACTIVE",
--    "rank": "108",
--    "streak": "108",
--    "mischance": "0",
--    "mischance_confidence": "0",
--    "start_height": "22846",
--    "inactive_until": "1970-01-01T00:00:00Z",
--    "last_present_block": "22956",
--    "missed_blocks_counter": "0",
--    "produced_blocks_counter": "108",
--    "validator_node_id": "db7d5f16e3c2c76c0007b4fb0513dc687c0f7b23"
--  }

CREATE TABLE IF NOT EXISTS validator (    
  address TEXT NOT NULL,
  status TEXT NOT NULL,
  pubkey TEXT NOT NULL,  
  moniker TEXT NOT NULL,  
  tokens DECIMAL(30,0) NOT NULL,
  delegator_shares DECIMAL(30,0) NOT NULL,
  unbonding_height INT NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( address, timestamp )
);

CREATE TABLE IF NOT EXISTS delegators (
  address TEXT NOT NULL,
  available DECIMAL(30,0) NOT NULL,
  delegated DECIMAL(30,0) NOT NULL,
  unbonding DECIMAL(30,0) NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( address, timestamp )
);

CREATE TABLE IF NOT EXISTS delegations (
  delegator_address TEXT NOT NULL,
  validator_address TEXT NOT NULL,
  amount DECIMAL(30,0) NOT NULL,
  timestamp BIGINT NOT NULL,
  PRIMARY KEY ( delegator_address, validator_address, timestamp )
);

-- {
-- "active_validators": 160,
-- "paused_validators": 2,
-- "inactive_validators": 5,
-- "jailed_validators": 0,
-- "total_validators": 167,
-- "waiting_validators": 352
-- }

-- CREATE TABLE IF NOT EXISTS network (  
--   bonded_validators INT NOT NULL,
--   unbonded_validators INT NOT NULL,
--   unbonding_validators INT NOT NULL,
--   jailed_validators INT NOT NULL,
--   total_validators INT NOT NULL,  
--   timestamp BIGINT NOT NULL,
--   PRIMARY KEY ( timestamp )
-- );

GRANT ALL PRIVILEGES ON TABLE validator TO evmostats;
GRANT ALL PRIVILEGES ON TABLE stats TO evmostats;
GRANT ALL PRIVILEGES ON TABLE delegations TO evmostats;
GRANT ALL PRIVILEGES ON TABLE delegators TO evmostats;
