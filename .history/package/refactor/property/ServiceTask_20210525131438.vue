<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="类型">
        <el-select  v-model="implementationType" @change="changeType">
          <el-option v-for="i in Object.keys(implementationTypes)" :key="i" :label="implementationTypes[i]" :value="i" />
        </el-select>
      </el-form-item>
      <el-form-item :label="implementationTypes[implementationType]">
        <el-input v-model="value" clearable />
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
      implementationType: 'class',
      value : '',
      implementationTypes: {
        class: "类",
        expression: "表达式",
        delegateExpression: "代理表达式",
      },
    };
  },
  watch: {
    value: function(val) {
      this.updateVal( this.implementationType,val );
    },
    'formData.skipExpression': function(val) {
      this.updateVal('flowable:skipExpression',val);
    },
  },
  mounted() {
    this.formData = commonParse(this.element);
    if (this.formData.class) {
      this.implementationType = 'class';
      this.value = this.formData.class;
    } else if (this.formData.expression) {
      this.implementationType = 'expression';
      this.value = this.formData.expression
    } else if (this.formData.delegateExpression) {
      this.implementationType = 'delegateExpression';
      this.value = this.formData.delegateExpression;
    } else {
      this.implementationType = 'class';
    }
  },
  methods: {
    changeType(val) {
      // console.log(this.formData.type)
      // this.updateVal( val,this.formData.value);
      // console.log(this.formData)
      // let index;
      // for (index in this.implementationTypes) {
      //   console.log(index);
      //   if(index !== val) {
      //     this.updateVal( index,null );
      //   }
      // }
    }
  }
};
</script>
