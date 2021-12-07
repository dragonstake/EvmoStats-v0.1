<template>
  <div v-if="proposal" class="proposal py-4">
    <div class="row">
      <div class="col-md-12">
        <div class="p-3 w-100 border border-light text-break">
          <vue-json-pretty
            :data="proposal"
            :show-line="false"
            :show-double-quotes="false"
          ></vue-json-pretty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
export default {
  components: {
    VueJsonPretty,
  },
  props: {
    proposal: {
      type: Object,
      default: undefined,
    },
  },
}
</script>
