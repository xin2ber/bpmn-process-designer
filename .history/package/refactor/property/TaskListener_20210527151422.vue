<template>
  <listener :eventType = "eventType" type = "TaskListener" :modeler = "modeler" :element = "element"/>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import Listener from './Listener.vue'

export default {
  components: { Listener },
  name: "TaskListener",
  mixins: [mixinPanel],

  data() {
    return {
      eventType: {
        create: "创建",
        assignment: "指派",
        complete: "完成",
        delete: "删除",
        all: "所有"
        }
    }
  }
}
</script>
