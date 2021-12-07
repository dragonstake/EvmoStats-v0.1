<template>
  <reactive-line-chart
    :chart-data="chartData"
    :options="chartOptions"
    :height="200"
    style="background-color: rgba(0, 0, 0, 1)"
  />
</template>
<script>
import gql from 'graphql-tag'
import commonMixin from '@/mixins/commonMixin.js'
import ReactiveLineChart from '@/components/charts/ReactiveLineChart'

export default {
  components: {
    ReactiveLineChart,
  },
  mixins: [commonMixin],
  props: {
    address: {
      type: String,
      default: () => '',
    },
    fromTimestamp: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Shares',
          fontSize: 18,
          fontColor: '#fff',
          fontStyle: 'lighter',
        },
        tooltips: {
          backgroundColor: '#000000',
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
        },
      },
      chartData: {},
    }
  },
  methods: {
    updateTimestamp(value) {
      this.$store.commit('timestamp/update', value)
    },
  },
  apollo: {
    $subscribe: {
      delegator: {
        query: gql`
          subscription delegator($address: String!, $timestamp: bigint!) {
            delegators(
              order_by: { timestamp: asc }
              where: {
                address: { _eq: $address }
                timestamp: { _gte: $timestamp }
              }
            ) {
              delegated
              timestamp
            }
          }
        `,
        variables() {
          return {
            address: this.address,
            timestamp: this.fromTimestamp.toString(),
          }
        },
        skip() {
          return !this.chartData
        },
        result({ data }) {
          const newData = {
            ...this.chartData,
          }

          newData.labels = data.delegators.map(({ timestamp }) =>
            this.timestampToDate(timestamp, 'DD[/]MM HH[h]')
          )

          newData.datasets = [
            {
              labels: 'Shares',
              data: data.delegators.map(
                ({ delegated }) => parseFloat(delegated) / Math.pow(10, 18)
              ),
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderWidth: 1,
              borderColor: 'rgba(176, 156, 255, 1)',
              pointRadius: 1,
              hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
              fill: false,
              showLine: true,
            },
          ]
          this.updateTimestamp(
            data.delegators[data.delegators.length - 1].timestamp
          )
          this.chartData = newData
        },
      },
    },
  },
}
</script>
