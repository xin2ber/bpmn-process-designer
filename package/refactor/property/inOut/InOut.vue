<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" size="mini" max-height="240" border fit>
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
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openAttributesForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="remove($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">添加属性</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "In",
  props: {
    id: String,
    type: String,
    inOrOut: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      elementPropertyList: []
    };
  },
  watch: {
    elementPropertyList: {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
  },
  mounted() {
    this.resetAttributesList();
  },
  methods: {
    add() {
      this.elementPropertyList.splice(this.elementPropertyList.length, 0, {});
    },
    remove(index) {
      this.elementPropertyList.splice(index, 1);
    },
    resetAttributesList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.elementPropertyList =
      this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
        return ex.$type === `${this.prefix}:${this.inOrOut}`;
      }).map(item => {
        return {
          source: item.source || item.sourceExpression,
          target: item.target || item.targetExpression
        }
      }) ?? [];
      // 复制 显示
      this.$emit("computedIns",this.elementPropertyList?.length);
    },
    updateElement() {
      this.$emit("computedIns",this.elementPropertyList?.length);
      if (this.elementPropertyList?.length) {
        let extensionElements = this.bpmnElement.businessObject.extensionElements;
        if (!extensionElements) {
          extensionElements = window.bpmnInstances.moddle.create("bpmn:ExtensionElements");
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.inOrOut}`) ?? []
        this.elementPropertyList.forEach(item => {
          const inOut = window.bpmnInstances.moddle.create(`flowable:${this.inOrOut}`)
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
        })
        this.updateElementExtensions(extensionElements)
      } else {
        const extensionElements = this.bpmnElement.businessObject?.extensionElements;
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.inOrOut}`) ?? []
        }
      }
    },
    updateElementExtensions(extensionElements) {
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensionElements
      });
    }
  }
};
</script>
