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
          text: 'Jailed',
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
          subscription stats($timestamp: bigint!) {
            stats(
              where: { timestamp: { _gte: $timestamp } }
              order_by: { timestamp: asc }
            ) {
              timestamp
              jailedValidators: stats(path: "status.jailed_validators")
            }
          }
        `,
        variables() {
          return {
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

          newData.labels = data.stats.map(({ timestamp }) =>
            this.timestampToDate(timestamp, 'DD[/]MM HH[h]')
          )

          newData.datasets = [
            {
              labels: 'Paused',
              data: data.stats.map(({ jailedValidators }) =>
                parseInt(jailedValidators)
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
