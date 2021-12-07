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
          text: 'Unbonding height',
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
              ticks: {
                precision: 0,
              },
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
  apollo: {
    $subscribe: {
      chartData: {
        query: gql`
          subscription validator($address: String!, $timestamp: bigint!) {
            validator(
              where: {
                address: { _eq: $address }
                timestamp: { _gte: $timestamp }
              }
              order_by: { timestamp: asc }
            ) {
              unbondingHeight: unbonding_height
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

          newData.labels = data.validator.map(({ timestamp }) =>
            this.timestampToDate(timestamp, 'DD[/]MM HH[h]')
          )

          newData.datasets = [
            {
              labels: 'Unbonding height',
              data: data.validator.map(({ unbondingHeight }) =>
                parseInt(unbondingHeight)
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

          this.chartData = newData
        },
      },
    },
  },
}
</script>
