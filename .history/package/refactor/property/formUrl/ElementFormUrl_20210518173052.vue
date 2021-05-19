<template>
<<<<<<< HEAD
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
=======
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
>>>>>>> b4e6245806c9dc7c012885bffa8ba9d37c92b0c6
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
<<<<<<< HEAD
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
    'formData.pcUrl': function(val) {
      this.updateProperties({ pcUrl: val })
    },
    'formData.pcInfoUrl': function(val) {
      this.updateProperties({ pcInfoUrl: val })
    },
    'formData.mobileUrl': function(val) {
      this.updateProperties({ mobileUrl: val })
    },
    'formData.mobileInfoUrl': function(val) {
      this.updateProperties({ mobileInfoUrl: val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
=======
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
>>>>>>> b4e6245806c9dc7c012885bffa8ba9d37c92b0c6
};
</script>
