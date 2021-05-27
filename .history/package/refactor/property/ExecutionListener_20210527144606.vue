<template>
  <task-listener :eventType = "eventType" type = "executionListener"/>
</template>

<script>
import TaskListener from './TaskListener.vue'
export default {
  components: { TaskListener },
  name: "ExecutionListener",
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
