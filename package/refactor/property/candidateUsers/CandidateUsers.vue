<template>
  <div class="panel-tab__content">
    <el-table :data="elementPropertyList" size="mini" max-height="240" border fit>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" class="select" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="值">
        <template slot-scope="scope">
          <el-select v-if="scope.row.type == 'operator'" v-model="scope.row.value" class="select" placeholder="请选择" filterable allow-create>
            <el-option v-for="item in operatorList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-else v-model="scope.row.value" placeholder="请输入" />
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
  name: "CandidateUsers",
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      elementPropertyList: [],
      editingPropertyIndex: -1,
      typeList: [
        { label: "用户", value: "user" },
        { label: "脚本", value: "expression" },
        { label: "操作符", value: "operator" }
      ],
      operatorList: [
        { label: "交集", value: "∩" },
        { label: "并集", value: "∪" },
        { label: "差集", value: "-" },
        { label: "左括号", value: "(" },
        { label: "右括号", value: ")" }
      ]
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.resetAttributesList();
      }
    },
    elementPropertyList: {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
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
      this.otherExtensionList = []; // 其他扩展配置
      this.bpmnElementCandidates =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:Candidates`) {
            this.otherExtensionList.push(ex);
          }
          return ex.$type === `${this.prefix}:Candidates`;
        }) ?? [];
      // 保存所有的 扩展属性字段
      this.bpmnElementCandidateList = this.bpmnElementCandidates.reduce((pre, current) => pre.concat(current.candidates), []);
      // 复制 显示
      this.elementPropertyList = JSON.parse(JSON.stringify(this.bpmnElementCandidateList ?? []));
      this.$emit("computedCandidates",this.elementPropertyList?.length);
    },
    updateElement() {
      this.$emit("computedCandidates",this.elementPropertyList?.length);
      if (this.elementPropertyList?.length) {
        this.hasCandidatesUsers = true;
        let extensionElements = this.bpmnElement.businessObject.extensionElements;
        if (!extensionElements) {
          extensionElements = window.bpmnInstances.moddle.create("bpmn:ExtensionElements");
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== "flowable:Candidates") ?? [];
        const candidates = window.bpmnInstances.moddle.create("flowable:Candidates");
        this.elementPropertyList.forEach(item => {
          const candidate = window.bpmnInstances.moddle.create("flowable:Candidate");
          candidate["type"] = item.type;
          candidate["value"] = item.value;
          candidates.get("candidates").push(candidate);
        });
        extensionElements.values.push(candidates);
        this.updateElementExtensions(extensionElements);
      } else {
        this.hasCandidatesUsers = false;
        const extensionElements = this.bpmnElement.businessObject?.extensionElements;
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== "flowable:Candidates") ?? [];
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
