<template>
  <listener :eventType = "eventType" type = "ExecutionListener" :modeler = "modeler" :element = "element"/>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import Listener from './Listener.vue'

export default {
  components: { Listener },
  name: "ExecutionListener",
  mixins: [mixinPanel],

  data() {
    return {
      eventType: {
        start: "start",
        end: "end",
        take: "take"
      }
    }
  }
}
</script>
