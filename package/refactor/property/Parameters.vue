<template>
  <div class="panel-tab__content">
    <el-table :data="formData.inOuts" size="mini" max-height="320" border fit>
      <el-table-column label="source">
        <template slot-scope="scope">
          <el-input v-model="scope.row.source" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="target">
        <template slot-scope="scope">
          <el-input v-model="scope.row.target" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="remove($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">添加字段</el-button>
    </div>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'

export default {
  name: "Parameters",
  mixins: [mixinPanel],
  props: {
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      formData: {
        inOuts: []
      }
    };
  },

  mounted() {
    this.formData.inOuts = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === `flowable:${this.type}`)
      .map(item => {
        return {
          source: item.source || item.sourceExpression,
          target: item.target || item.targetExpression
        }
      }) ?? [];
  },
  watch: {
    'formData.inOuts': {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
  },
  methods: {
    add() {
      this.formData.inOuts.splice(this.formData.inOuts.length, 0, {});
    },
    remove(index) {
      this.formData.inOuts.splice(index, 1);
    },
    updateElement() {
        let extensionElements = this.element.businessObject?.extensionElements;
      if (this.formData.inOuts?.length) {
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create("bpmn:ExtensionElements");
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.type}`) ?? []
        this.formData.inOuts.forEach(item => {
          const inOut = this.modeler.get('moddle').create(`flowable:${this.type}`)
          if(item.source && item.target) {
            if (/\$+\{+.+\}/.test(item.source)) {
            inOut['sourceExpression'] = item.source
            } else {
              inOut['source'] = item.source
            }
            if (/\$+\{+.+\}/.test(item.target)) {
              inOut['targetExpression'] = item.target
            } else {
              inOut['target'] = item.target
            }
            extensionElements.values.push(inOut)
          }
        })
        this.updateProperties({ extensionElements: extensionElements })
        return;
      } 
      if (extensionElements) {
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.type}`) ?? []
        if (!extensionElements.values?.length) {
          this.updateProperties({ extensionElements: null })
        }
      }
    }
  }
};
</script>
