<template>
  <div class="container">
    <div class="row">
      <div class="last-updated col-12 text-right mt-2">
        Last updated: {{ timestamp }}
      </div>
    </div>

    <div class="row mb-3 mt-3">
      <b-navbar id="navbar" type="dark" class="col-md-12" toggleable="sm">
        <b-navbar-brand href="/" class="logo">EVMOSTATS</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="/">VALIDATORS</b-nav-item>
            <b-nav-item to="/proposals">PROPOSALS</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import commonMixin from '@/mixins/commonMixin.js'
export default {
  mixins: [commonMixin],
  computed: {
    timestamp() {
      return this.timestampToDate(this.$store.state.timestamp.timestamp)
    },
  },
}
</script>
<style scoped>
.last-updated {
  font-size: 0.9rem;
  font-family: 'Roboto-Light', sans-serif;
  color: #adb5bd;
}
</style>
