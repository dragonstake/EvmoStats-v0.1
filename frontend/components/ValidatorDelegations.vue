<template>
  <div class="validator-delegations">
    <h5 class="mt-5">Delegations</h5>
    <b-table
      id="validator-delegators-table"
      dark
      hover
      :items="setItems"
      :fields="fields"
    >
      <template #cell(delegator)="datos">
        <NuxtLink
          :to="`/delegator/${datos.item.delegator}`"
          :title="`${datos.item.delegator}`"
        >
          {{ datos.item.delegator }}
        </NuxtLink>
      </template>
      <template #cell(amount)="datos">
        {{ (datos.item.amount / Math.pow(10, 18)).toFixed(6) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'

export default {
  props: {
    address: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'delegator',
          sortable: true,
          thStyle: { width: '15%' },
          class: ['delegator'],
        },
        {
          key: 'amount',
          label: 'Amount',
          sortable: true,
          thStyle: { width: '10%' },
          class: ['amount'],
        },
      ],
      items: [],
    }
  },
  computed: {
    setItems() {
      return this.items.map((item) => {
        return {
          delegator: item.delegator_address,
          amount: item.amount,
        }
      })
    },
  },
  apollo: {
    $subscribe: {
      delegators: {
        query: gql`
          subscription delegations($address: String!) {
            delegations(
              where: { validator_address: { _eq: $address } }
              distinct_on: delegator_address
              order_by: { delegator_address: asc, timestamp: desc }
            ) {
              delegator_address
              amount
            }
          }
        `,
        variables() {
          return {
            address: this.address,
          }
        },
        result({ data }) {
          this.items = data.delegations
        },
      },
    },
  },
}
</script>

<style>
h5 {
  font-family: 'Roboto-Thin', sans-serif;
  font-size: 1.5rem;
}
</style>
