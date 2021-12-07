<template>
  <div class="container" :v-if="proposal">
    <Proposal :proposal="proposal" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      id: this.$route.params.id,
      proposal: undefined,
    }
  },
  watch: {
    $route() {
      this.id = this.$route.params.id
    },
  },
  async created() {
    const response = await axios.get(this.$config.apiProposals + '/' + this.id)
    this.proposal = response.data.proposal
  },
}
</script>
