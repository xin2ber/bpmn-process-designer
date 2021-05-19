<template>
  <div class="panel-tab__content">
    <el-form label-width="90px" size="mini" @submit.native.prevent>
      <el-form-item label="流转类型">
        <el-select v-model="type" @change="updateFlowType">
          <el-option label="条件流转路径" value="condition" />
          <el-option label="普通流转路径" value="normal" />
          <el-option label="默认流转路径" value="default" />
        </el-select>
      </el-form-item>
      <template  v-if="type === 'condition'">
        <el-form-item label="跳转条件">
          <el-input v-model="formData.conditionExpression" />
        </el-form-item>
        <el-form-item label="跳过表达式">
          <el-input v-model="formData.skipExpression" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import { commonParse, conditionExpressionParse } from '../../../common/parseElement'

export default {
  name : 'FlowCondition',
  mixins: [mixinPanel],
  data() {
    return {
      type: 'condition',
      formData: {}
    }
  },

  watch: {
    'formData.conditionExpression': function(val) {
      this.updateCondition(val)
    },
    'formData.skipExpression': function(val) {
      this.updateVal('flowable:skipExpression',val)
    },
    'element.businessObject.conditionExpression': function(val) {
      console.log(val)
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
    if(this.formData.conditionExpression) {
      this.type = 'condition';
    } else {
      if( this.element.source.businessObject.default?.id === this.element.id) {
        this.type = 'default'
      }else {
        this.type = 'normal';
      }
    }
  },
  methods: {
    updateFlowType(flowType) {
      console.log(flowType);
      if (flowType === "default") {
        this.updateCondition(null);
        this.updateDefalut(this.element);
        this.updateVal('flowable:skipExpression',null)
      }
      else if (flowType === "condition") {
        this.updateVal('flowable:skipExpression',this.formData.skipExpression);
        this.updateCondition(this.formData.conditionExpression);
        this.updateDefalut(null);
      }
      else if(flowType === "normal") {
        this.updateCondition(null);
        this.updateDefalut(null);
        this.updateVal('flowable:skipExpression',null);
      }
    },

    updateCondition(val) {
      let newCondition = null;
      if (val) {
        newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
      }
      this.updateVal('conditionExpression',newCondition)
    },

    updateDefalut(element) {
      let elementSource = this.element.source;
      this.modeler.get('modeling').updateProperties(elementSource, {default: element});
    }
  }
};
</script>
