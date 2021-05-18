<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="formData.id"
          :disabled="idEditDisabled || elementType === 'bpmn:Process'"
          clearable
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formData.name" clearable/>
      </el-form-item>
      <!--流程的基础属性-->
        <el-form-item v-if="showConfig.versionTag" label="版本">
          <el-input v-model="formData.versionTag" disabled/>
        </el-form-item>
        <el-form-item v-if="showConfig.processCategory" label="类别">
        <el-select v-model="formData.processCategory">
          <el-option v-for="item in categorys" :key="item.categoryCode"  :label="item.categoryName" :value="item.categoryCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="formData.documentation"
          size="mini"
          resize="vertical"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../../common/mixinPanel'
import { commonParse } from '../../../common/parseElement'
import { getCategoryList } from '../../../api/api'

export default {
  name: "ElementBaseInfo",
  props: {
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  mixins: [mixinPanel],
  data() {
    return {
      formData: {},
      categorys: []
    };
  },
  watch: {
    'formData.id': function(val) {
      this.updateProperties({ id: val })
    },
    'formData.name': function(val) {
      this.updateProperties({ name: val })
    },
    'formData.versionTag': function(val) {
      this.updateProperties({ versionTag: val })
    },
    'formData.processCategory': function(val) {
      this.updateProperties({ processCategory: val })
    },
    'formData.documentation': function(val) {
      if (!val) {
        this.updateProperties({ documentation: [] })
        return
      }
      const documentationElement = this.modeler.get('moddle').create('bpmn:Documentation', { text: val })
      this.updateProperties({ documentation: [documentationElement] })
    },
  },
  created() {
    this.formData = commonParse(this.element)
  },
  mounted() {
    getCategoryList().then(resp => {
      this.categorys = resp;
    })
  }
};
</script>
