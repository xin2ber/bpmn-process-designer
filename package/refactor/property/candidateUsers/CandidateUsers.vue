<template>
  <div class="panel-tab__content">
    <el-table :data="formData.candidates" size="mini" max-height="240" border fit>
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
        <template slot-scope="{ $index }">
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
import mixinPanel from '../../../common/mixinPanel'
import { getCandidatesTypeList } from '../../../api/api'

export default {
  name: "CandidateUsers",

  inject: {
    prefix: "prefix",
    width: "width"
  },
  mixins: [mixinPanel],
  data() {
    return {
      formData: {
        candidates: []
      },
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
  mounted() {
    getCandidatesTypeList().then(resp => {
      this.typeList = resp.data.concat(this.typeList)
    })
    this.formData.candidates = this.element.businessObject.extensionElements?.values?.filter(item => item.$type === 'flowable:Candidates')[0]?.get('candidates')
      ?.map(item => {
        return {
          type: item.type,
          value: item.value
        }
      }) ?? []
  },
  watch: {
    'formData.candidates': {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
  },
  methods: {
    add() {
      this.formData.candidates.splice(this.formData.candidates.length, 0, {});
    },
    remove(index) {
      this.formData.candidates.splice(index, 1);
    },
    updateElement() {
      let extensionElements = this.element.businessObject.get('extensionElements')
      if (this.formData.candidates?.length) {
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:Candidates') ?? []
        const candidates = this.modeler.get('moddle').create('flowable:Candidates')
        this.formData.candidates.forEach(item => {
          if (item.type && item.value) {
            const candidate = this.modeler.get('moddle').create('flowable:Candidate')
            candidate['type'] = item.type
            candidate['value'] = item.value
            candidates.get('candidates').push(candidate)
          }
        })
        if (candidates.get('candidates')?.length) {
          extensionElements.get('values').push(candidates)
          this.updateProperties({ extensionElements: extensionElements })
          return;
        }
      } 
      if (extensionElements) {
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:Candidates') ?? [];
        if (!extensionElements.values?.length) {
          this.updateProperties({ extensionElements: null })
        }
      }
    }
  }
};
</script>
