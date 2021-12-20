<template>
  <div class="net-stats border-bottom container">
    <div class="row mt-4 mb-3">
      <div v-if="blockHeight" class="col-4 text-center">
        <p>Block height</p>
        <h2 class="net-stats-font">{{ blockHeight }}</h2>
      </div>
      <div v-if="bondedTokens" class="col-4 text-center">
        <p>Bonded tokens</p>
        <h2 class="net-stats-font">{{ bondedTokens }}%</h2>
      </div>
      <div v-if="inflation" class="col-4 text-center">
        <p>Inflation</p>
        <h2 class="net-stats-font">{{ inflation }}%</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      blockHeight: 0,
      bondedTokens: 0,
      inflation: 0,
    }
  },
  async created() {
    let response = await axios.get(`${this.$config.apiEvmos}blocks/latest`)
    this.blockHeight = response.data.block.header.height

    response = await axios.get(`${this.$config.apiEvmos}staking/pool`)
    const total =
      parseInt(response.data.result.not_bonded_tokens) +
      parseInt(response.data.result.bonded_tokens)
    this.bondedTokens = (
      (parseInt(response.data.result.bonded_tokens) / total) *
      100
    ).toFixed(1)

    response = await axios.get(`${this.$config.apiEvmos}minting/inflation`)
    this.inflation = (response.data.result * 100).toFixed(1)
  },
}
</script>
