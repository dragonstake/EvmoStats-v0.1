<template>
  <div class="ficha position-relative">
    <div v-if="validator.status" class="status">
      <span class="label">Status: </span>
      <span :class="status().toLowerCase()">{{ status() }}</span>
    </div>
    <div class="row">
      <div v-if="logo" class="col-md-2 pb-3">
        <div class="logo"><img :src="logo" alt="logo" /></div>
      </div>
      <div class="col-md-10">
        <span class="label">Operator address:</span><br /><span
          class="operator_address"
          >{{ validator.operator_address }}</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 label">Voting power:</div>
      <div class="col-md-9">
        {{ (validator.tokens / Math.pow(10, 18)).toFixed(6) }}
      </div>
    </div>
    <div v-if="validator.description.moniker" class="row">
      <div class="col-md-3 label">Moniker:</div>
      <div class="col-md-9">{{ validator.description.moniker }}</div>
    </div>
    <div v-if="validator.description.identity" class="row">
      <div class="col-md-3 label">Identity:</div>
      <div class="col-md-9">{{ validator.description.identity }}</div>
    </div>
    <div v-if="validator.description.details" class="row">
      <div class="col-md-3 label">Details:</div>
      <div class="col-md-9">{{ validator.description.details }}</div>
    </div>
    <div v-if="validator.description.security_contact" class="row">
      <div class="col-md-3 label">Security contact:</div>
      <div class="col-md-9">
        <a :href="`mailto:${validator.description.security_contact}`">{{
          validator.description.security_contact
        }}</a>
      </div>
    </div>
    <div v-if="validator.description.website" class="row">
      <div class="col-md-3 label">Website:</div>
      <div class="col-md-9">
        <a :href="validator.description.website">{{
          validator.description.website
        }}</a>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 label">Commission:</div>
      <div class="col-md-9">
        {{ validator.commission.commission_rates.rate * 100 }}%
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 label">Delegator shares:</div>
      <div class="col-md-9">
        {{ (validator.delegator_shares / Math.pow(10, 18)).toFixed(6) }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    validator: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      logo: undefined,
    }
  },
  async created() {
    if (this.validator.description.identity) {
      let response = await axios.get(
        `${this.$config.apiKeybase}key/fetch.json?pgp_key_ids=${this.validator.description.identity}`
      )

      const uid = response.data.keys[0].uid

      response = await axios.get(
        `${this.$config.apiKeybase}user/lookup.json?uid=${uid}`
      )

      this.logo = response.data.them.pictures.primary.url
    }
  },
  methods: {
    status() {
      const longStatus = this.validator.status
      return longStatus.substr(
        longStatus.lastIndexOf('_') + 1,
        longStatus.length - 1
      )
    },
  },
}
</script>

<style scoped>
.ficha {
  font-family: 'Roboto-Thin', sans-serif;
  font-size: 1.5rem;
}

.label {
  font-family: 'Roboto', sans-serif;
}

.bonded {
  color: green;
}

.unbonded {
  color: red;
}

.unbonding {
  color: orange;
}

img {
  width: 100%;
  height: auto;
  max-width: 160px;
}

.status {
  position: absolute;
  text-align: right;
  top: 0;
  right: 0;
}

@media screen and (max-width: 576px) {
  .status {
    position: static;
    text-align: left;
  }
}

.operator_address {
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  word-break: break-word;
}
</style>
