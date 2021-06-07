<template>
  <div class="panel-tab__content">
    <el-table :data="elementListenersList" size="mini" border>
      <el-table-column label="时机" min-width="80px" show-overflow-tooltip :formatter="row => listenerEventTypeObject[row.event]" />
      <el-table-column label="描述" min-width="80px" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="text" @click="openListenerForm(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="removeListener(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="openListenerForm(null)">添加</el-button>
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <el-dialog :visible.sync="listenerFormModelVisible" title="消息配置" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form size="mini" :model="listenerForm" label-width="96px" ref="listenerFormRef" @submit.native.prevent>
        <el-form-item label="消息描述" prop="remark" :rules="{required: true, message: '请输入', trigger: ['blur', 'change'] }">
          <el-input v-model="listenerForm.remark" clearable />
        </el-form-item>
        <el-form-item label="执行时机" prop="event" :rules="{ required: true, message: '请输入', trigger: ['blur', 'change'] }">
          <el-select v-model="listenerForm.event">
            <el-option v-for="i in Object.keys(listenerEventTypeObject)" :key="i" :label="listenerEventTypeObject[i]" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知人" prop="recipients" >
          <el-tag
            :key="tag"
            v-for="tag in listenerForm.recipients"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{recipientTypes[tag] || tag}}
          </el-tag>
          <el-select
            filterable
            allow-create
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @change="handleInputConfirm"
          >
            <el-option v-for="i in selectableRecipients" :key="i" :label="recipientTypes[i]" :value="i" />
          </el-select>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
        </el-form-item>
        <el-form-item label="条件" prop="condition" >
          <el-input v-model="listenerForm.condition" clearable />
        </el-form-item>
        <el-form-item label="消息模板" prop="template" :rules="{ required: true, message: '请输入', trigger: ['blur', 'change'] }">
          <el-input type="textarea" v-model="listenerForm.template" size="mini" resize="vertical" :autosize="{ minRows: 3, maxRows: 5 }"/>
        </el-form-item>
        <el-form-item label="消息类型" :rules="{ required: true }">
          <el-checkbox-group v-model="listenerForm.checkedMessageTypes">
            <el-checkbox v-for="messageType in messageTypes" :label="messageType.key" :key="messageType.key">{{messageType.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="element-drawer__button">
        <el-button size="mini" @click="listenerFormModelVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveListenerConfig">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'

export default {
  name: "Message",
  mixins: [mixinPanel],
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      elementListeners: [],
      elementListenersList: [],
      listenerEventTypeObject: {create: '创建',end: '完成'},
      listenerFormModelVisible: false,
      listenerForm: { checkedMessageTypes: ["mail"]},
      editingListenerIndex: -1, // 监听器所在下标，-1 为新增
      messageTypes: [{key:"sms",name:"短信"},{key:"mail",name:"邮件"}],
      recipientTypes:  {candidates: '任务候选人',start: '流程发起人'},
      inputVisible: false,
      inputValue: ''
    };
  },
  mounted() {
    this.resetListenersList();
  },
  computed: {
    selectableRecipients() {
      let selectableRecipients = []
      console.log(this.listenerForm.recipients);
      for(let key in this.recipientTypes) {
        //当前不存在，就放到可选择中
        if (this.listenerForm.recipients.indexOf(key) < 0) {
            selectableRecipients.push(key);
        }
      }
      console.log(selectableRecipients);
      return selectableRecipients;
    }
  },
  methods: {
    handleClose(tag) {
      this.listenerForm.recipients.splice( this.listenerForm.recipients.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        console.log(this.$refs.saveTagInput);
        this.$refs.saveTagInput.$refs.reference.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.listenerForm.recipients.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    resetListenersList() {
      this.otherExtensionList = [];
      this.elementListeners =
        this.element.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `flowable:TaskListener` || ex.delegateExpression !== '${customTaskListener}') {
            this.otherExtensionList.push(ex);
            return false
          }
          return true;
        }) ?? [];
      this.elementListenersList = this.elementListeners.map(listener => this.initListenerType(listener));
    },
    initListenerType(item) {
      let listenerForm = {
         event: item.event
      };
      item.fields.forEach(field => {
        if(field.name === 'remark') {
          listenerForm.remark = field.expression
        }
        if(field.name === 'recipients') {
          listenerForm.recipients = field.expression.split(',')
        }
        if(field.name === 'condition') {
          listenerForm.condition = field.expression
        }
        if(field.name === 'checkedMessageTypes') {
          listenerForm.checkedMessageTypes = field.expression.split(',')
        }
        if(field.name === 'template') {
          listenerForm.template = field.expression
        }
      });
      return listenerForm
    },
    openListenerForm(listener, index) {
      if (listener) {
        this.listenerForm = listener;
        this.editingListenerIndex = index;
      } else {
        this.listenerForm = {checkedMessageTypes: ["mail"],recipients:["candidates"]};
        this.editingListenerIndex = -1; // 标记为新增
      }
      // 打开侧边栏并清楚验证状态
      this.listenerFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
      });
    },

    // 移除监听器
    removeListener(listener, index) {
      this.$confirm("确认移除该设置吗？", "提示", {
        confirmButtonText: "确 认",
        cancelButtonText: "取 消"
      })
        .then(() => {
          this.elementListeners.splice(index, 1);
          this.elementListenersList.splice(index, 1);
          let extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
          extensionElements.values = this.otherExtensionList.concat(this.elementListeners)
          this.updateProperties({ extensionElements: extensionElements })
        })
        .catch(() => console.info("操作取消"));
    },
    // 保存监听器
    async saveListenerConfig() {
      let validateStatus = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus) return; 
      const listenerObject = this.createListner()
      if (this.editingListenerIndex === -1) {
        this.elementListeners.push(listenerObject);
        this.elementListenersList.push(this.listenerForm);
      } else {
        this.elementListeners.splice(this.editingListenerIndex, 1, listenerObject);
        this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm);
      }
      let extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
      extensionElements.values = this.otherExtensionList.concat(this.elementListeners)
      this.updateProperties({ extensionElements: extensionElements })
      this.listenerFormModelVisible = false;
    },

    createField(key) {
      const fieldElement = this.modeler.get('moddle').create('flowable:Field')
      fieldElement['name'] = key
      let value = this.listenerForm[key]
      if(value instanceof Array) {
        fieldElement['expression'] = value.toString()
      } else {
        fieldElement['expression'] = value
      }
      return fieldElement
    },
    createListner() {
      const listener = this.modeler.get('moddle').create(`flowable:TaskListener`)
      listener['event'] = this.listenerForm.event
      listener['delegateExpression'] = '${customTaskListener}'
      for(let key in this.listenerForm) {
        if(key !== 'event') {
          listener.get('fields').push(this.createField(key))
        }
      }
      return listener
    }
  }
};
</script>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    width: 150px;
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 150px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>