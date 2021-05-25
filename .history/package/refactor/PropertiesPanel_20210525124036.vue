<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <div v-if="nodeName" class="node-name">{{ nodeName }}</div>
    <el-collapse v-model="activeTab">
        <template v-for="(item, key) in showConfig.components">
          <el-collapse-item :key="key" v-if="element" :name="item">
            <div slot="title" class="panel-tab__title"><i :class="getComponentIcon(item)"></i>{{getComponentName(item)}}</div>
            <component
            :is="item"
            :element="element"
            :modeler="bpmnModeler"
            />
          </el-collapse-item>
        </template>
    </el-collapse>
  </div>
</template>
<script>
import BaseInfo from "./property/BaseInfo";
import ReceiveTask from "./property/ReceiveTask";
import ScriptTask from "./property/ScriptTask";
import UserTask from "./property/UserTask";
import ServiceTask from "./property/ServiceTask";
import TaskListeners from "./property/TaskListeners";

import MultiInstance from "./property/MultiInstance.vue";
import Condition from "./property/Condition";
import ElementListeners from "./property/ElementListeners";
import ElementProperties from "./property/ElementProperties";
import CandidateUsers from "./property/CandidateUsers";
import FormUrl from "./property/FormUrl";
import InOut from "./property/InOut";
import CallActivity from "./property/CallActivity";
import { NodeName } from "../../package/process-designer/plugins/translate/zh";
import showConfig from '../common/showConfig'
import { ComponentName } from '../common/showConfig'

/**
 * 侧边栏
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    ElementProperties,
    ElementListeners,
    Condition,
    MultiInstance,
    ReceiveTask,
    ScriptTask,
    ServiceTask,
    UserTask,
    BaseInfo,
    CandidateUsers,
    FormUrl,
    InOut,
    CallActivity,
    TaskListeners
  },
  componentName: "MyPropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "flowable"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      element: null,
      activeTab: "BaseInfo",
      elementId: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false, // 表单配置
      hasValue: {},
      hasCandidatesUsers: false
    };
  },
  computed: {
    nodeName() {
      if (this.element) {
        return NodeName[this.elementType] || this.elementType
      }
      return ''
    },
    elementType() {
      if (this.element) {
        const bizObj = this.element.businessObject
        return bizObj.eventDefinitions
          ? bizObj.eventDefinitions[0].$type
          : bizObj.$type
      }
        return ''
    },
    showConfig() {
      if (this.element) {
        return showConfig[this.elementType] || {}
      }
      return {}
    }
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "base";
      }
    }
  },
  mounted() {
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      this.initElement();
    },
    initElement() {
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        
      })
      this.bpmnModeler.on('root.added', e => {
        if (e.element.type === 'bpmn:Process') {
          this.element = null
          this.$nextTick().then(() => {
            this.element = e.element
          })
        }
      })
      this.bpmnModeler.on('element.click', e => {
        const { element } = e
        if (element.type === 'bpmn:Process') {
            this.$nextTick().then(() => {
            this.element = element
          })
        }
      })
      this.bpmnModeler.on('selection.changed', e => {
        // hack 同类型面板不刷新
        this.element = null
        const element = e.newSelection[0]
        if (element) {
            this.$nextTick().then(() => {
            this.element = element
          })
        }
      })
    },
    computedCandidates(hasCandidatesUsers) {
      // console.log(hasCandidatesUsers);
      // this.hasCandidatesUsers = hasCandidatesUsers;
    },
    getComponentName(val){
      return ComponentName[val]?.name || '其他';
    },
    getComponentIcon(val){
      return ComponentName[val]?.icon || 'el-icon-info';
    }
  }
};
</script>
<style>
  .node-name{
    padding: 0 0 10px 20px;
    margin-top: 20px;
    margin-bottom: 3px;
    font-size: 18px;
    font-weight: bold;
    color: #444;
  }
</style>
