<template>
  <div class="panel-tab__content">
    <el-form :model="formData" label-width="90px" size="mini" @submit.native.prevent>
      <el-form-item label="流转类型">
        <el-select v-model="type" @change="updateFlowType">
          <el-option label="条件流转路径" value="condition" />
          <el-option label="普通流转路径" value="normal" />
          <el-option label="默认流转路径" value="default" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转条件" v-if="formData.type === 'conditionExpression'">
        <el-input v-model="flowConditionForm.conditionExpression" />
      </el-form-item>
      <el-form-item label="跳过表达式" v-if="formData.type === 'skipExpression'">
        <el-input v-model="flowConditionForm.conditionExpression" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import { commonParse, conditionExpressionParse } from '../../../common/parseElement'

export default {
  mixins: [mixinPanel],
  data() {
    return {
      type: 'condition',
      formData: {}
    }
  },

  watch: {
    'formData.conditionExpression': function(val) {
      let newCondition = null;
      if (val) {
        newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
      }
      this.updateVal('flowable:skipExpression',newCondition)
    },
    'formData.skipExpression': function(val) {
      this.updateVal('flowable:skipExpression',val)
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
  },
  methods: {
    updateFlowType(flowType) {
      // 正常条件类
      if (flowType === "condition") {
        this.flowConditionRef = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: this.flowConditionRef
        });
        return;
      }
      // 默认路径
      if (flowType === "default") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: null
        });
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: this.bpmnElement
        });
        return;
      }
      // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
      if (this.bpmnElementSourceRef.default && this.bpmnElementSourceRef.default.id === this.bpmnElement.id) {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: null
        });
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        conditionExpression: null
      });
    },
  }
};
</script>
