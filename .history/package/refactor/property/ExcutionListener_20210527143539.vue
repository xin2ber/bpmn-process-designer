<template>
  <task-listener :eventType = "eventType" type = "ExecutionListener"/>
</template>

<script>
import TaskListener from './TaskListener.vue'
export default {
  components: { TaskListener },
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
