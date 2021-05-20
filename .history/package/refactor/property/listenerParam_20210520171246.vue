<template>
  <el-drawer :visible.sync="dialogVisible" title="任务监听器" size="500px" append-to-body destroy-on-close>
    <div class="panel-tab__content">
      <el-table :data="formData.paramList" size="mini" max-height="800" border fit>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-input v-model="scope.row.type" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" placeholder="请输入" />
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
  </el-drawer>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        paramList: this.value
      },
      typeList: {
        stringValue: '字符串',
        expression: '表达式'
      }
    }
  },
  methods: {
    add() {
      this.formData.paramList.splice(this.formData.paramList.length, 0, {});
    },
    remove(index) {
      this.formData.paramList.splice(index, 1);
    }
  }
}
</script>

<style>
.flow-containers  .el-badge__content.is-fixed {
    top: 18px;
}
</style>
