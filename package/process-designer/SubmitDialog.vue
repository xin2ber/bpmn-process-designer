<template>
  <div>
    <el-dialog
      title="提交"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="dialogClose"
    >
      <el-form ref="form" :model="options" label-width="90px">
        <el-form-item v-if="deployed" label="发布方式：">
          <el-select v-model="options.deployType" placeholder="请选择">
            <el-option
              v-for="item in deployTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="deployed" label="保存草稿：">
          <el-switch v-model="options.saveDraft" active-text="是" inactive-text="否" :disabled="options.deployType==='no'" />
        </el-form-item>
        <el-form-item v-else label="是否发布：">
          <el-switch v-model="options.deployType" active-value="create" inactive-value="no" active-text="是" inactive-text="否" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SubmitDialog",
  props: {
    submitDialogFlag: {
      default: false,
      type: Boolean
    },
    deployed: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      options: {
        saveDraft: true,
        deployType: 'create'
      },
      deployTypes: [
        {
          value: 'create',
          label: '发布新版本'
        }, {
          value: 'update',
          label: '修改当前版本'
        }, {
          value: 'no',
          label: '不发布'
        }
      ],
      dialogVisible: false
    }
  },
  watch: {
    submitDialogFlag() {
      this.dialogVisible = this.submitDialogFlag
    },
    "options.deployType" : function (val) {
      if( val === "no") {
        this.options.saveDraft = true;
      }
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.options)
    },
    dialogClose() {
      this.$emit('update:submitDialogFlag', false)
    }
  }
}
</script>

