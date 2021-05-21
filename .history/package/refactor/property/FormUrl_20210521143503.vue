<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="105px" @submit.native.prevent>
      <el-form-item label="PC端">
        <el-input v-model="formData.pcUrl" clearable/>
      </el-form-item>
      <el-form-item label="PC端详情">
        <el-input v-model="formData.pcInfoUrl" clearable/>
      </el-form-item>
      <el-form-item label="移动端">
        <el-input v-model="formData.mobileUrl" clearable/>
      </el-form-item>
      <el-form-item label="移动端详情">
        <el-input v-model="formData.mobileInfoUrl" clearable/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import mixinPanel from '../../common/mixinPanel'
import { commonParse } from '../../common/parseElement'

export default {
  name: "FormUrl",
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
    },
    formData: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.updateHasValue();
      }
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
  methods: {
    updateHasValue() {
      console.log(this.formData);
      this.$emit("updateHasValue", "FromUrl"+this.element.id,Boolean(this.formData.pcUrl || this.formData.pcInfoUrl || this.formData.mobileUrl || this.formData.mobileInfoUrl))
    }
  }
};
</script>
