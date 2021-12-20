<template>
  <div v-if="proposals" class="container py-4">
    <h3>PROPOSALS</h3>
    <div class="proposals mt-3">
      <b-table
        id="proposals-table"
        dark
        hover
        :items="proposals"
        :fields="fields"
        :sort-by="sortBy"
        :sort-desc="true"
      >
        <template #cell(title)="datos">
          <NuxtLink :to="`/proposal/${datos.item.id}`">
            {{ datos.item.title }}
          </NuxtLink>
        </template>
        <template #cell(status)="datos">
          <span :class="statusArray[datos.item.status - 1]">{{
            statusArray[datos.item.status - 1].toUpperCase()
          }}</span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      fields: [
        {
          key: 'id',
          sortable: true,
        },
        {
          key: 'title',
        },
        {
          key: 'status',
          sortable: true,
        },
        {
          key: 'voting_start',
          class: ['d-none', 'd-md-table-cell'],
        },
        {
          key: 'submit_time',
          class: ['d-none', 'd-md-table-cell'],
        },
        {
          key: 'total_deposit',
          sortable: true,
        },
      ],
      proposals: null,
      sortBy: 'id',
      statusArray: ['deposit_period', 'voting_period', 'passed', 'rejected'],
    }
  },
  async mounted() {
    const response = await axios.get(`${this.$config.apiEvmos}gov/proposals`)
    this.proposals = response.data.result.map((item) => {
      return {
        id: item.id,
        title: item.content.value
          ? item.content.value.title
          : item.content.title,
        status: item.status,
        voting_start: new Date(item.voting_start_time).toLocaleString(),
        submit_time: new Date(item.submit_time).toLocaleString(),
        total_deposit: item.total_deposit[0] ? item.total_deposit[0].amount : 0,
      }
    })
  },
}
</script>

<style>
.passed {
  color: green;
}

.rejected {
  color: red;
}

.voting_period {
  color: #00b1ff;
}

.deposit_period {
  color: orange;
}
</style>
