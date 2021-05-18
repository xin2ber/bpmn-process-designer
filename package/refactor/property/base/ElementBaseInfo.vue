<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="类别">
        <el-select v-model="elementBaseInfo.processCategory" @change="updateBaseInfo('processCategory')">
          <el-option v-for="item in categorys" :key="item.categoryCode"  :label="item.categoryName" :value="item.categoryCode" />
        </el-select>
      </el-form-item>
      </template>
      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="documentation"
          size="mini"
          resize="vertical"
          :autosize="{ minRows: 2, maxRows: 4 }"
          @change="updateDocumentation()"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCategoryList } from '../../../api/api'

export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {},
      documentation: '',
      categorys: ['1']
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function(val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      }
    }
  },
  mounted() {
    getCategoryList().then(resp => {
      this.categorys = resp;
    })
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement;
      this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
      const documentationElements = window.bpmnInstances.bpmnElement.businessObject?.documentation;
      this.documentation = documentationElements && documentationElements.length ? documentationElements[0].text : "";
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      console.log(attrObj)
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: this.elementBaseInfo[key] }
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
      }
    },
    updateDocumentation() {
      console.log( this.documentation);
      if (this.documentation) {
        const documentationElement = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: this.documentation });
        console.log(documentationElement);
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          documentation: [documentationElement]
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          documentation: null
        });
      }
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
