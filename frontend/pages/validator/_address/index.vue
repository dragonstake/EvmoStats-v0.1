<template>
  <div class="container">
    <Validator :address="address" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: this.$route.params.address,
    }
  },
  watch: {
    $route() {
      this.address = this.$route.params.address
    },
  },
}
</script>
