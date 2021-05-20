<template>
  <div class="panel-tab__content">
    <el-table :data="formData.taskListener" size="mini" max-height="240" border fit>
      <el-table-column label="事件">
        <template slot-scope="scope">
          <el-select v-model="scope.row.event" class="select" placeholder="请选择">
            <el-option v-for="i in Object.keys(eventType)" :key="i" :label="eventType[i]" :value="i" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-select  v-model="scope.row.type" class="select" placeholder="请选择" filterable allow-create>
            <el-option v-for="i in Object.keys(listenerType)" :key="i" :label="listenerType[i]" :value="i" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <el-input v-model="scope.row.className" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="remove($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">添加监听器</el-button>
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <listener-param v-if="showParamDialog" :value="formData.taskListener[nowIndex].params" @close="finishConfigParam" />


  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'
import { createListenerObject, updateElementExtensions } from "../../utils";
import ListenerParam from './ListenerParam';
import { initListenerForm, initListenerType, eventType, listenerType, fieldType } from "./utilSelf";

export default {
  components: { listenerParam },
  name: "TaskListeners",
  mixins: [mixinPanel],
  data() {
    return {
      formData: {
        taskListener: []
      },
      eventType: eventType,
      listenerType: {
        class: "Java 类",
        expression: "表达式",
        delegateExpression: "代理表达式",
      },
      fieldType: fieldType,
      showParamDialog: false
    };
  },
  watch: {
    'formData.taskListener': {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
  },
  mounted() {
    console.log(this.eventType)
    this.formData.taskListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:TaskListener')
      .map(item => {
        let type
        if ('class' in item) type = 'class'
        if ('expression' in item) type = 'expression'
        if ('delegateExpression' in item) type = 'delegateExpression'
        return {
          event: item.event,
          type: type,
          className: item[type],
          params: item.fields?.map(field => {
            let fieldType
            if ('stringValue' in field) fieldType = 'stringValue'
            if ('expression' in field) fieldType = 'expression'
            return {
              name: field.name,
              type: fieldType,
              value: field[fieldType]
            }
          }) ?? []
        }
      }) ?? []
  },
  methods: {
    add() {
      this.formData.taskListener.splice(this.formData.taskListener.length, 0, {});
    },
    remove(index) {
      this.formData.taskListener.splice(index, 1);
    },
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.taskListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.showParamDialog = true
    },
    finishConfigParam(param) {
      this.showParamDialog = false
      // hack 数量不更新问题
      const cache = this.formData.taskListener[this.nowIndex]
      cache.params = param
      this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.taskListener?.length) {
        console.log(this.formData.taskListener);
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
        this.formData.taskListener.forEach(item => {
          const taskListener = this.modeler.get('moddle').create('flowable:TaskListener')
          taskListener['event'] = item.event
          taskListener[item.type] = item.className
          console.log(taskListener)
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              taskListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(taskListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
        }
      }
    }
  }
};
</script>
