<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="类型">
        <el-select v-model="loopCharacteristics" @change="changeLoopCharacteristicsType">
          <!--bpmn:MultiInstanceLoopCharacteristics-->
          <el-option label="并行" value="ParallelMultiInstance" />
          <el-option label="串行" value="SequentialMultiInstance" />
          <el-option label="无" value="Null" />
        </el-select>
      </el-form-item>
      <template v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'">
        <el-form-item label="集合" key="collection">
          <el-input v-model="loopInstanceForm.collection" clearable @change="updateLoopBase" />
        </el-form-item>
        <el-form-item label="元素变量" key="elementVariable">
          <el-input v-model="loopInstanceForm.elementVariable" clearable @change="updateLoopBase" />
        </el-form-item>
        <el-form-item label="循环基数" key="loopCardinality">
          <el-input v-model="loopInstanceForm.loopCardinality" clearable @change="updateLoopCardinality" />
        </el-form-item>
        <el-form-item label="完成条件" key="completionCondition">
          <el-input v-model="loopInstanceForm.completionCondition" clearable @change="updateLoopCondition" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ElementMultiInstance",
  props: {
    businessObject: Object,
    type: String
  },
  inject: {
    prefix: "prefix"
  },
  data() {
    return {
      loopCharacteristics: "",
      //默认配置，用来覆盖原始不存在的选项，避免报错
      defaultLoopInstanceForm: {
        completionCondition: "",
        loopCardinality: ""
      },
      loopInstanceForm: {}
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler(val) {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.getElementLoop(val);
      }
    }
  },
  methods: {
    getElementLoop(businessObject) {
      if (!businessObject.loopCharacteristics) {
        this.loopCharacteristics = "Null";
        this.loopInstanceForm = {};
        return;
      }
      if (businessObject.loopCharacteristics.isSequential) {
        this.loopCharacteristics = "SequentialMultiInstance";
      } else {
        this.loopCharacteristics = "ParallelMultiInstance";
      }
      // 合并配置
      this.loopInstanceForm = {
        ...this.defaultLoopInstanceForm,
        ...businessObject.loopCharacteristics,
        completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? "",
        loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ""
      };
      // 保留当前元素 businessObject 上的 loopCharacteristics 实例
      this.multiLoopInstance = window.bpmnInstances.bpmnElement.businessObject.loopCharacteristics;
    },
    changeLoopCharacteristicsType(type) {
      // this.loopInstanceForm = { ...this.defaultLoopInstanceForm }; // 切换类型取消原表单配置
      // 取消多实例配置
      if (type === "Null") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { loopCharacteristics: null });
        return;
      }
      // 时序
      if (type === "SequentialMultiInstance") {
        this.multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics", { isSequential: true });
      } else {
        this.multiLoopInstance = window.bpmnInstances.moddle.create("bpmn:MultiInstanceLoopCharacteristics");
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        loopCharacteristics: this.multiLoopInstance
      });
    },
    // 循环基数
    updateLoopCardinality(cardinality) {
      let loopCardinality = null;
      if (cardinality && cardinality.length) {
        loopCardinality = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: cardinality });
      }
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, { loopCardinality });
    },
    // 完成条件
    updateLoopCondition(condition) {
      let completionCondition = null;
      if (condition && condition.length) {
        completionCondition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body: condition });
      }
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, { completionCondition });
    },
    // 直接更新的基础信息
    updateLoopBase() {
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnElement, this.multiLoopInstance, {
        collection: this.loopInstanceForm.collection || null,
        elementVariable: this.loopInstanceForm.elementVariable || null
      });
    }
  },
  beforeDestroy() {
    this.multiLoopInstance = null;
    this.bpmnElement = null;
  }
};
</script>
