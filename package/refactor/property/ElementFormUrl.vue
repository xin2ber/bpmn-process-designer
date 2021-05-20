<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="105px" @submit.native.prevent>
      <el-form-item label="PC端URL">
        <el-input v-model="formData.pcUrl" clearable/>
      </el-form-item>
      <el-form-item label="PC端详情URL">
        <el-input v-model="formData.pcInfoUrl" clearable/>
      </el-form-item>
      <el-form-item label="移动URL">
        <el-input v-model="formData.mobileUrl" clearable/>
      </el-form-item>
      <el-form-item label="移动详情URL">
        <el-input v-model="formData.mobileInfoUrl" clearable/>
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
    'formData.pcUrl': function(val) {
      this.updateProperties({ pcUrl: val || null})
    },
    'formData.pcInfoUrl': function(val) {
      this.updateProperties({ pcInfoUrl: val || null})
    },
    'formData.mobileUrl': function(val) {
      this.updateProperties({ mobileUrl: val || null})
    },
    'formData.mobileInfoUrl': function(val) {
      this.updateProperties({ mobileInfoUrl: val || null})
    }
  },
  created() {
    this.formData = commonParse(this.element)
  }
};
</script>
