<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="类型">
        <el-select v-model="type" @change="changeLoopCharacteristicsType">
          <el-option label="并行" value="ParallelMultiInstance" />
          <el-option label="串行" value="SequentialMultiInstance" />
          <el-option label="无" value="Null" />
        </el-select>
      </el-form-item>
      <template v-if="type === 'ParallelMultiInstance' || type === 'SequentialMultiInstance'">
        <el-form-item label="集合" key="collection">
          <el-input v-model="formData.collection" clearable />
        </el-form-item>
        <el-form-item label="元素变量" key="elementVariable">
          <el-input v-model="formData.elementVariable" clearable />
        </el-form-item>
        <el-form-item label="循环基数" key="loopCardinality">
          <el-input v-model="formData.loopCardinality" clearable />
        </el-form-item>
        <el-form-item label="完成条件" key="completionCondition">
          <el-input v-model="formData.completionCondition" clearable />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../../common/mixinPanel'
import { formatJsonKeyValue } from '../../../common/parseElement'

export default {
  name: "ElementMultiInstance",
  mixins: [mixinPanel],
  data() {
    return {
      type: 'Null',
      formData: {}
    }
  },
  watch: {
    'formData.collection': function(val) {
      this.updateElement('collection',val)
    },
    'formData.elementVariable': function(val) {
      this.updateElement('elementVariable',val)
    },
    'formData.loopCardinality': function(val) {
      this.updateElement('loopCardinality',this.createCardinality(val))
    },
    'formData.completionCondition': function(val) {
      this.updateElement('completionCondition',this.createCompletionCondition(val))
    }
  }, 
  mounted() {
    if (this.element.businessObject.loopCharacteristics) {
      const cache = JSON.parse(JSON.stringify(this.element.businessObject.loopCharacteristics ?? {}))
      cache.completionCondition = cache.completionCondition?.body
      cache.loopCardinality = cache.loopCardinality?.body
      cache.isSequential = cache.isSequential ?? false
      if (cache.isSequential) {
        this.type = "SequentialMultiInstance"
      } else {
        this.type = "ParallelMultiInstance"
      }
      this.formData = formatJsonKeyValue(cache)
    }
  },
  methods: {
    updateElement(key,val) {
      let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      if (!loopCharacteristics) {
        loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
      }
      loopCharacteristics[key] = val
      this.updateProperties({ loopCharacteristics: loopCharacteristics })
    },
    changeLoopCharacteristicsType(type) {
      if (type === "Null") {
        this.updateProperties({ loopCharacteristics: null })
        return;
      }
      // 时序
      let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      if (!loopCharacteristics) {
        loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
      }
      loopCharacteristics['collection'] = this.formData.collection
      loopCharacteristics['elementVariable'] = this.formData.elementVariable
      loopCharacteristics['completionCondition'] =  this.createCompletionCondition(this.formData.completionCondition)
      loopCharacteristics['loopCardinality'] =  this.createCardinality(this.formData.loopCardinality)
      if (type === "SequentialMultiInstance") {
        loopCharacteristics['isSequential'] = true
      } else {
        delete loopCharacteristics.isSequential
      }
      this.updateProperties({ loopCharacteristics: loopCharacteristics });
    },
    // 循环基数
    createCardinality(val) {
      let loopCardinality = null;
      if (val) {
        loopCardinality = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
      }
      return loopCardinality;

    },
    // 完成条件
    createCompletionCondition(val) {
      let completionCondition = null;
      if (val) {
        completionCondition = this.modeler.get('moddle').create('bpmn:Expression', { body: val })
      }
      return completionCondition;
    }
  }
}
</script>
