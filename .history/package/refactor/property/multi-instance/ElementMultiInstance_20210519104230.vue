<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="类型">
        <el-select v-bind:value="type" @change="changeType">
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
          <el-input v-model="formData.elementVariable" clearabl />
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
  name : "ElementMultiInstance",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {}
    }
  },
  mounted() {
    console.log(121212);
    if (this.element.businessObject.loopCharacteristics) {
      const cache = JSON.parse(JSON.stringify(this.element.businessObject.loopCharacteristics ?? {}))
      cache.completionCondition = cache.completionCondition?.body
      cache.isSequential = cache.isSequential ?? false
      this.formData = formatJsonKeyValue(cache)
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
      this.updateElement('loopCardinality',this.createElement(val))
    },
    'formData.completionCondition': function(val) {
      this.updateElement('completionCondition',this.createElement(val))
    }
  },
  computed : {
    type() {
      let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      if (loopCharacteristics) {
          if(loopCharacteristics['isSequential']) {
            return "SequentialMultiInstance";
          }else{
            return "ParallelMultiInstance";
          }
      } else {
        return 'Null'
      }
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
    changeType(val) {
      if (val === "Null") {
        this.updateProperties({ loopCharacteristics: null })
        return;
      }
      let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      if (!loopCharacteristics) {
        loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
      }
      if(this.formData.collection) {
        loopCharacteristics['collection'] = this.formData.collection
      }
      if(this.formData.elementVariable) {
        loopCharacteristics['elementVariable'] = this.formData.elementVariable
      }
      if(this.formData.loopCardinality) {
        loopCharacteristics['loopCardinality'] = this.createElement(this.formData.loopCardinality)
      }
      if(this.formData.completionCondition) {
        loopCharacteristics['completionCondition'] =  this.createElement(this.formData.completionCondition)
      }
      if (val === "SequentialMultiInstance") {
        loopCharacteristics['isSequential'] = true;
      } else {
        delete loopCharacteristics.isSequential;
      }
      this.updateProperties({ loopCharacteristics: loopCharacteristics })
    },
    createElement(val) {
      let element = null;
      if(val){
         element = this.modeler.get('moddle').create('bpmn:Expression', { body: val })
      }
      return element
    }
  }
};
</script>
