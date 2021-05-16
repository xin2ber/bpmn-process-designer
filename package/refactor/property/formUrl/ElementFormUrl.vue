<template>
  <div style="margin-top: 16px">
    <el-form size="mini" label-width="105px" @submit.native.prevent>
      <el-form-item label="PC端URL">
        <el-input v-model="userTaskForm.pcUrl" clearable @change="updateElementTask('pcUrl')" />
      </el-form-item>
      <el-form-item label="PC端详情URL">
        <el-input v-model="userTaskForm.pcInfoUrl" clearable @change="updateElementTask('pcInfoUrl')" />
      </el-form-item>
      <el-form-item label="移动URL">
        <el-input v-model="userTaskForm.mobileUrl" clearable @change="updateElementTask('mobileUrl')" />
      </el-form-item>
      <el-form-item label="移动详情URL">
        <el-input v-model="userTaskForm.mobileInfoUrl" clearable @change="updateElementTask('mobileInfoUrl')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserTask",
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      defaultTaskForm: {
        pcUrl: "",
        pcInfoUrl: "",
        mobileUrl: "",
        mobileInfoUrl: ""
      },
      userTaskForm: {},
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.$nextTick(() => this.resetTaskForm());
      }
    }
  },
  methods: {
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        this.$set(this.userTaskForm, key, value);
      }
    },
    updateElementTask(key) {
      let taskAttr = Object.create(null);
      taskAttr[key] = this.userTaskForm[key] || null;
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
