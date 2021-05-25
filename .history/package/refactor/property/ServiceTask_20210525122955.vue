<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="类型">
          <el-select  v-model="formData.type" class="select" placeholder="请选择" filterable allow-create>
            <el-option v-for="i in Object.keys(implementationTypes)" :key="i" :label="implementationTypes[i]" :value="i" />
          </el-select>
      </el-form-item>
      <el-form-item :label="implementationTypes[formData.type]">
        <el-input v-model="formData.value" clearable />
      </el-form-item>
      <el-form-item label="跳过条件">
        <el-input v-model="formData.skipExpression" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'
import { commonParse } from '../../common/parseElement'

export default {
  name: "ServcieTask",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {},
      implementationTypes: {
        class: "类",
        expression: "表达式",
        delegateExpression: "代理表达式",
      },
    };
  },
  watch: {
    'formData.type': function(val) {
      this.updateVal( val,this.formData.val);
      for (x in this.implementationTypes) {
        if(x !== val) {
          this.updateVal( x,null );
        }
      }
    },
    'formData.value': function(val) {
      this.updateVal( this.formData.type,val );
    },
    'formData.skipExpression': function(val) {
      this.updateVal('flowable:skipExpression',val);
    },
  },
  created() {
    this.formData = commonParse(this.element);
    if (this.formData.class) {
      this.formData.type = 'class';
      this.formData.value = this.formData.class;
    } else if (this.formData.expression) {
      this.formData.type = 'expression';
      this.formData.value = this.formData.expression
    } else if (this.formData.delegateExpression) {
      this.formData.type = 'delegateExpression';
      this.formData.value = this.formData.delegateExpression;
    }
  }
};
</script>
