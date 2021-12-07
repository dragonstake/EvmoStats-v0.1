<template>
  <div class="overflow-auto">
    <b-form-input
      id="filterInput"
      v-model="filter"
      type="search"
      placeholder="Search validator by name or address"
      class="mb-3"
    />
    <b-table
      id="evmos-ranking-table"
      dark
      hover
      :items="setItems"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      :filter-included-fields="['moniker', 'address']"
      sort-by="rank"
      sort-desc
    >
      <template #cell(index)="datos">
        {{ datos.index + 1 }}
      </template>
      <template #cell(moniker)="datos">
        <NuxtLink :to="`validator/${datos.item.address}`">
          {{ datos.item.moniker }}
        </NuxtLink>
      </template>
      <template #cell(address)="datos">
        <NuxtLink
          :to="`validator/${datos.item.address}`"
          :title="`${datos.item.address}`"
        >
          {{ datos.item.address }}
        </NuxtLink>
      </template>
      <template #cell(tokens)="datos">
        {{ (datos.item.tokens / Math.pow(10, 18)).toFixed(6) }}
      </template>
      <template #cell(status)="datos">
        <span :class="datos.item.status.toLowerCase()">{{
          datos.item.status
        }}</span>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="data.length"
      :per-page="perPage"
      aria-controls="evmos-ranking-table"
    ></b-pagination>

    <p class="mt-3">Current Page: {{ currentPage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'index',
          label: '',
          thStyle: { width: '1%' },
        },
        {
          key: 'moniker',
          sortable: true,
          thStyle: { width: '10%' },
          class: ['moniker'],
        },
        {
          key: 'address',
          sortable: true,
          thStyle: { width: '20%' },
          class: ['address', 'd-none', 'd-md-table-cell'],
        },
        {
          key: 'tokens',
          label: 'Tokens (photons)',
          sortable: true,
          thStyle: { width: '5%' },
        },
        {
          key: 'status',
          sortable: true,
          thStyle: { width: '5%' },
          class: ['d-none', 'd-sm-table-cell'],
        },
      ],
      items: [],
      perPage: 50,
      currentPage: 1,
      filter: null,
    }
  },
  computed: {
    setItems() {
      return this.data.map((item) => {
        return {
          moniker: item.description.moniker,
          tokens: item.tokens,
          address: item.operator_address,
          status: item.status.substr(
            item.status.lastIndexOf('_') + 1,
            item.status.length - 1
          ),
        }
      })
    },
  },
}
</script>
<style>
@media all and (max-width: 420px) {
  .address {
    width: 50%;
  }
}

.address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}

.bonded {
  color: green;
}

.unbonded {
  color: red;
}

.unbonding {
  color: orange;
}
</style>
