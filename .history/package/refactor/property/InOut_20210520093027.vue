<template>
 <el-tabs type="border-card">
  <el-tab-pane label="输入">
    <parameters type='In' :modeler='modeler' :element='element'/>
  </el-tab-pane>
  <el-tab-pane label="输出">
    <parameters type='Out' :modeler='modeler' :element='element'/>
  </el-tab-pane>
</el-tabs>
</template>

<script>
import Parameters from '../inOut/Parameters.vue'
export default {
props: {
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    }
  },
    components: {
        Parameters
    }
}
</script>
