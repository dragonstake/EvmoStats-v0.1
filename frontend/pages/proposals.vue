<template>
  <div class="container py-4">
    <h3>PROPOSALS</h3>
    <div class="proposals mt-3">
      <b-table
        id="proposals-table"
        dark
        hover
        :items="proposals"
        :fields="fields"
      >
        <template #cell(title)="datos">
          <NuxtLink :to="`/proposal/${datos.item.id}`">
            {{ datos.item.title }}
          </NuxtLink>
        </template>
        <template #cell(status)="datos">
          <span :class="datos.item.status.toLowerCase()">{{
            datos.item.status
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
        },
        {
          key: 'title',
        },
        {
          key: 'status',
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
        },
      ],
      proposals: null,
    }
  },
  async mounted() {
    const response = await axios.get(this.$config.apiProposals  + '?pagination.limit=1000')
    this.proposals = response.data.proposals.map((item) => {
      return {
        id: item.proposal_id,
        title: item.content.title,
        status: item.status.replace('PROPOSAL_STATUS_', ''),
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
