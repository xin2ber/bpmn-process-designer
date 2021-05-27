<template>
  <task-listener :eventType = "eventType" type = "ExecutionListener" :modeler = "modeler" :element = "element"/>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import TaskListener from './TaskListener.vue'

export default {
  components: { TaskListener },
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
