<template>
  <div class="py-4">
    <div>
      <h5 class="my-3">{{ address }}</h5>
    </div>
    <b-form-select v-model="timespanDays" :options="options"></b-form-select>
    <div class="row">
      <div class="col-xl-6 pb-4">
        <DelegatedChart :address="address" :from-timestamp="fromTimestamp" />
      </div>
      <div class="col-xl-6 pb-4">
        <AvailableChart :address="address" :from-timestamp="fromTimestamp" />
      </div>
    </div>
  </div>
</template>

<script>
import DelegatedChart from '@/components/charts/delegator/DelegatedChart'
import AvailableChart from '@/components/charts/delegator/AvailableChart'

export default {
  components: {
    DelegatedChart,
    AvailableChart,
  },
  props: {
    address: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      delegator: null,
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
}
</script>
