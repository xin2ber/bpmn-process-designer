<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="81px" @submit.native.prevent>
      <el-form-item label="到期时间">
        <el-input v-model="formData.dueDate" clearable />
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model="formData.priority" clearable />
      </el-form-item>
      <el-form-item label="跳过条件">
        <el-input v-model="formData.skipExpression" />
      </el-form-item>
      <el-form-item label="自动完成 ">
        <el-input v-model="formData.completeAutoExpression" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'
import { commonParse } from '../../common/parseElement'

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
      this.updateVal( 'dueDate',val )
    },
    'formData.followUpDate': function(val) {
      this.updateVal( 'followUpDate',val )
    },
    'formData.priority': function(val) {
      this.updateVal( 'priority',val )
    },
    'formData.skipExpression': function(val) {
        if(val) {
          this.updateVal('flowable:skipExpression',val);
        } else {
          delete this.element.businessObject.$attrs['flowable:skipExpression']
        }
    },
    'formData.completeAutoExpression': function(val) {
      this.updateVal('flowable:completeAutoExpression',val)
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
};
</script>
