<template>
  <div v-if="ranking">
    <div class="row mt-4 stats">
      <div class="col-sm-6 col-md-4 text-center">
        <h2 class="display-1">{{ ranking.bonded_validators }}</h2>
        <p>Bonded validators</p>
      </div>
      <div class="col-sm-6 col-md-4 text-center">
        <h2 class="display-1">{{ ranking.unbonded_validators }}</h2>
        <p>Unbonded validators</p>
      </div>
      <div class="col-sm-6 col-md-4 text-center">
        <h2 class="display-1">{{ ranking.unbonding_validators }}</h2>
        <p>Unbonding validators</p>
      </div>
      <div class="col-sm-6 col-md-4 text-center">
        <h2 class="display-1">{{ ranking.jailed_validators }}</h2>
        <p>Jailed validators</p>
      </div>
      <div class="col-sm-6 col-md-4 text-center">
        <h2 class="display-1">{{ ranking.total_validators }}</h2>
        <p>Total validators</p>
      </div>
    </div>
    <b-tabs content-class="mt-4" class="mt-4">
      <b-tab title="RANKING" active>
        <EvmosRankingTable :data="validators" :options="chartOptions" />
      </b-tab>
      <b-tab title="CHARTS">
        <b-form-select
          v-model="timespanDays"
          :options="options"
        ></b-form-select>
        <div class="row">
          <div class="col-xl-6 pb-4">
            <BondedValChart :from-timestamp="fromTimestamp" />
          </div>
          <div class="col-xl-6 pb-4">
            <UnbondedValChart :from-timestamp="fromTimestamp" />
          </div>
        </div>
        <div class="row">
          <div class="col-xl-6 pb-4">
            <UnbondingValChart :from-timestamp="fromTimestamp" />
          </div>
          <div class="col-xl-6 pb-4">
            <JailedValChart :from-timestamp="fromTimestamp" />
          </div>
        </div>
        <div class="row">
          <div class="col-xl-6 pb-4">
            <TotalValChart :from-timestamp="fromTimestamp" />
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import BondedValChart from '@/components/charts/total/BondedValChart'
import UnbondedValChart from '@/components/charts/total/UnbondedValChart'
import UnbondingValChart from '@/components/charts/total/UnbondingValChart'
import JailedValChart from '@/components/charts/total/JailedValChart'
import TotalValChart from '@/components/charts/total/TotalValChart'
import axios from 'axios'

export default {
  components: {
    BondedValChart,
    UnbondedValChart,
    UnbondingValChart,
    JailedValChart,
    TotalValChart,
  },
  data() {
    return {
      validators: [],
      ranking: undefined,
      chartOptions: {
        responsive: true,
        indexAxis: 'y',
      },
      timespanDays: 1,
      options: [
        { value: 1, text: 'Last day' },
        { value: 3, text: 'Last three days' },
        { value: 7, text: 'Last week' },
        { value: 30, text: 'Last month' },
        { value: 0, text: 'All' },
      ],
      proposals: undefined,
    }
  },
  computed: {
    fromTimestamp() {
      if (this.timespanDays === 0) {
        return 0
      }
      const timespan = this.timespanDays * 24 * 60 * 60 * 1000
      const now = new Date().getTime()
      return now - timespan
    },
  },
  async created() {
    const response = await axios.get(this.$config.apiProposals + '?pagination.limit=1000')
    this.proposals = response.data.proposals
  },
  methods: {
    updateTimestamp(value) {
      this.$store.commit('timestamp/update', value)
    },
  },
  apollo: {
    $subscribe: {
      extrinsic: {
        query: gql`
          subscription stats {
            stats(order_by: { timestamp: desc }, limit: 1) {
              timestamp
              stats
            }
          }
        `,
        result({ data }) {
          this.ranking = data.stats[0].stats.status
          this.validators = this.ranking.validators.sort((a, b) =>
            parseInt(a.tokens) > parseInt(b.tokens) ? -1 : 1
          )

          this.updateTimestamp(data.stats[0].timestamp)
        },
      },
    },
  },
}
</script>
