<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="到期时间">
        <el-input v-model="formData.dueDate" clearable />
      </el-form-item>
      <el-form-item label="跟踪时间">
        <el-input v-model="formData.followUpDate" clearable />
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model="formData.priority" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../../common/mixinPanel'
import { commonParse } from '../../../common/parseElement'

export default {
  name: "UserTask",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {}
    };
  },
  watch: {
    'formData.dueDate': function(val) {
      this.updateProperties({ dueDate: val })
    },
    'formData.followUpDate': function(val) {
      this.updateProperties({ followUpDate: val })
    },
    'formData.priority': function(val) {
      this.updateProperties({ priority: val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
};
</script>
