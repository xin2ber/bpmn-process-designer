<template>
  <div class="panel-tab__content">
    <el-table :data="formData.listeners" size="mini" max-height="240" border fit>
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
      <el-table-column label="字段" width="50px">
        <template slot-scope="scope">
          <el-badge :value="scope.row.params ? scope.row.params.length : 0" type="primary" class="item">
            <el-button size="mini" type="text" @click="configParam(scope.$index)">配置</el-button>
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="remove($index)" class="item">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">添加监听器</el-button>
    </div>
    <listener-param v-if="showParamDialog" :value="formData.listeners[nowIndex].params" @close="finishConfigParam" />
  </div>
</template>
<script>
import mixinPanel from '../../common/mixinPanel'
import ListenerParam from './ListenerParam';

export default {
  components: { ListenerParam },
  name: "Listener",
  mixins: [mixinPanel],
  props: {
    eventType: {
      type: Object,
      default: () => {
        return {
        create: "创建",
        assignment: "指派",
        complete: "完成",
        delete: "删除",
        all: "所有"
        }
      }
    },
    type: {
      type: String,
      default: "Listener"
    }
  },
  data() {
    return {
      formData: {
        listeners: []
      },
      listenerType: {
        class: "类",
        expression: "表达式",
        delegateExpression: "代理表达式",
      },
      showParamDialog: false
    };
  },
  watch: {
    'formData.listeners': {
      immediate: false,
      deep: true,
      handler(val) {
        this.updateElement();
      }
    }
  },
  mounted() {
    this.formData.listeners = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === `flowable:${this.type}`)
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
      this.formData.listeners.splice(this.formData.listeners.length, 0, {});
    },
    remove(index) {
      this.formData.listeners.splice(index, 1);
    },
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.listeners[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.showParamDialog = true
    },
    finishConfigParam(param) {
      this.showParamDialog = false
      // hack 数量不更新问题
      const cache = this.formData.listeners[this.nowIndex]
      cache.params = param
      this.$set(this.formData.listeners[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.listeners?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.type}`) ?? []
        this.formData.listeners.forEach(item => {
          const taskListener = this.modeler.get('moddle').create(`flowable:${this.type}`)
          taskListener['event'] = item.event
          taskListener[item.type] = item.className
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
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== `flowable:${this.type}`) ?? []
        }
      }
    }
  }
};
</script>
<style scoped>
  .item{
    margin-top: 8px;
    margin-right: 40px;
  }
</style>
