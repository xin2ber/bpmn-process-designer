<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" :rules="rules" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="formData.id"
          :disabled="idEditDisabled"
          clearable
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formData.name" clearable />
      </el-form-item>
        <el-form-item label="版本" v-if="showConfig.versionTag">
          <el-input v-model="formData.versionTag" clearable/>
        </el-form-item>
        <el-form-item label="类别" v-if="showConfig.processCategory">
        <el-select v-model="formData.processCategory">
          <el-option v-for="item in categorys" :key="item.categoryCode"  :label="item.categoryName" :value="item.categoryCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" v-if="showConfig.documentation">
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
import { getCategoryList } from '../../api/api'
import mixinPanel from '../../common/mixinPanel'
import { commonParse } from '../../common/parseElement'

export default {
  name: "BaseInfo",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {},
      rules:{
        id :[{required: true, message: '请输入', trigger: 'blur'}],
        name :[{required: true, message: '请输入', trigger: 'blur'}]
      },
      idEditDisabled: false,
      categorys: []
    };
  },
  watch: {
    'formData.id': function(val) {
      if(!this.idEditDisabled) {
        this.updateVal('id',val)
      }
    },
    'formData.name': function(val) {
      this.updateVal('name',val)
    },
    'formData.versionTag': function(val) {
      this.updateVal('versionTag',val)
    },
    'formData.processCategory': function(val) {
      this.updateVal('processCategory',val)
    },
    'formData.documentation': function(val) {
      if (!val) {
        this.updateProperties({ documentation: [] })
        return
      }
      const documentationElement = this.modeler.get('moddle').create('bpmn:Documentation', { text: val })
      this.updateProperties({ documentation: [documentationElement] })
    }
  },
  created() {
    this.idEditDisabled =this.element.type === 'bpmn:Process'&& (Boolean(document.getElementById('modelId').value) || Boolean(document.getElementById('processDefinitionId').value));
    this.formData = commonParse(this.element);
  },
  mounted() {
    getCategoryList().then(resp => {
      this.categorys = resp
    })
  }
};



</script>
