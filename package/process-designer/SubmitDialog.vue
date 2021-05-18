<template>
  <div>
    <el-dialog
      title="提交"
      :visible.sync="dialogVisible"
      width="450px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="dialogClose"
    >
      <el-form ref="form" :model="options" label-width="90px">
        <el-form-item v-if="deployed" label="发布方式：">
          <el-radio-group v-model="options.deployType">
            <el-radio label="create" border size="medium">发布新版本</el-radio>
            <el-radio label="update" border size="medium">修改发布版本</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="deployed" label="保存草稿：">
          <el-switch v-model="options.saveDraft" active-text="是" inactive-text="否" />
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
      dialogVisible: false
    }
  },
  watch: {
    submitDialogFlag() {
      console.log(1332323);
      this.dialogVisible = this.submitDialogFlag
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

