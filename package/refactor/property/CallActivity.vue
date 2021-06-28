<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="81px" @submit.native.prevent>

      <el-form-item label="调用流程">
        <el-input v-model="formData.calledElement" clearable />
      </el-form-item>
      <el-form-item label="业务key">
        <el-input v-model="formData.businessKey" clearable/>
      </el-form-item>
      <el-form-item label="实例名称">
        <el-input v-model="formData.processInstanceName" clearable />
      </el-form-item>
      <el-form-item label="继承变量">
        <el-switch v-model="formData.inheritVariables" active-value="true" inactive-value="false" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'
import { commonParse } from '../../common/parseElement'

export default {
  name: "CallActivity",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {}
    };
  },
  watch: {
    'formData.calledElement': function(val) {
      this.updateVal('calledElement',val)
    },
    'formData.businessKey': function(val) {
      if (val) {
        this.updateVal('flowable:businessKey',val)
      } else {
        delete this.element.businessObject.$attrs[`flowable:businessKey`]
      }
    },
    'formData.processInstanceName': function(val) {
      if (val) {
        this.updateVal('flowable:processInstanceName',val)
      } else {
        delete this.element.businessObject.$attrs[`flowable:processInstanceName`]
      }
    },
    'formData.inheritVariables': function(val) {
      if (val === 'true') {
        this.updateVal('flowable:inheritVariables',val)
      } else {
        delete this.element.businessObject.$attrs[`flowable:inheritVariables`]
      }
    }
  },
  created() {
    this.formData = commonParse(this.element)
  }
};
</script>
