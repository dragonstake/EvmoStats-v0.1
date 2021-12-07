<template>
  <div class="py-4">
    <div v-if="validator">
      <h1>{{ validator.moniker }}</h1>
      <b-tabs content-class="mt-4" class="mt-4">
        <b-tab title="INFO">
          <ValidatorMetrics :validator="validator" />
          <div
            v-if="
              address === 'evmosvaloper1s95dwnw7vuks688tnzuue0hl6gsczmzjlf759z'
            "
          >
            <ValidatorDelegations :address="address" />
          </div>
        </b-tab>
        <b-tab title="CHARTS">
          <b-form-select
            v-model="timespanDays"
            :options="options"
          ></b-form-select>
          <div class="row">
            <div class="col-xl-6 pb-4">
              <TokensChart :address="address" :from-timestamp="fromTimestamp" />
            </div>
            <div class="col-xl-6 pb-4">
              <DelegatorChart
                :address="address"
                :from-timestamp="fromTimestamp"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6 pb-4">
              <UnbondingChart
                :address="address"
                :from-timestamp="fromTimestamp"
              />
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'

import TokensChart from '@/components/charts/validator/TokensChart'
import DelegatorChart from '@/components/charts/validator/DelegatorChart'
import UnbondingChart from '@/components/charts/validator/UnbondingChart'

export default {
  components: {
    TokensChart,
    DelegatorChart,
    UnbondingChart,
  },
  props: {
    address: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      validator: null,
      chartData: [],
      labels: [],
      timespanDays: 1,
      options: [
        { value: 1, text: 'Last day' },
        { value: 3, text: 'Last three days' },
        { value: 7, text: 'Last week' },
        { value: 30, text: 'Last month' },
        { value: 0, text: 'All' },
      ],
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
  methods: {
    updateTimestamp(value) {
      this.$store.commit('timestamp/update', value)
    },
  },
  apollo: {
    $subscribe: {
      validator: {
        query: gql`
          subscription stats {
            stats(order_by: { timestamp: desc }, limit: 1) {
              timestamp
              stats
            }
          }
        `,
        result({ data }) {
          this.validator = data.stats[0].stats.status.validators.find(
            (validator) => validator.operator_address === this.address
          )
          console.log(this.validator)
          this.updateTimestamp(data.stats[0].timestamp)
        },
      },
    },
  },
}
</script>
