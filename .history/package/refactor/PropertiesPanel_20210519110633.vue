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


      <!-- <el-collapse-item v-if="showConfig.base" name="base">
        <div slot="title" class="panel-tab__title"><i class="el-icon-info"></i>基本信息</div>
        <element-base-info v-if="element" :element = "element" :modeler="bpmnModeler" :id-edit-disabled="idEditDisabled" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="condition" v-if="elementType === 'Process'" key="message">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-comment"></i>消息与信号</div>
        <signal-and-massage />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="condition" v-if="showConfig.condition" key="condition">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-promotion"></i>流转条件</div>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="condition" v-if="formVisible" key="form">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-order"></i>表单</div>
        <element-form :id="elementId" :type="elementType" />
      </el-collapse-item> -->
      <!-- <el-collapse-item name="task" v-if="showConfig.task" key="task">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>任务配置</div>
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="formUrl" v-if="showConfig.form">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>表单</div>
        <element-form-url :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="candidateUsers" v-if="showConfig.candidateUsers">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i><el-badge is-dot class="item" :hidden="!hasCandidatesUsers">节点人员</el-badge></div>
        <candidate-users v-if="element" :element = "element" :modeler="bpmnModeler" @computedCandidates="computedCandidates"/>
      </el-collapse-item>
      <el-collapse-item name="in" v-if="showConfig.in" key="in">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>输入</div>
        <in-out :id="elementId" :type="elementType" inOrOut="In" />
      </el-collapse-item>
      <el-collapse-item name="out" v-if="showConfig.out" key="out">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-claim"></i>输出</div>
        <in-out :id="elementId" :type="elementType" inOrOut="Out" />
      </el-collapse-item>
      <el-collapse-item name="multiInstance" v-if="showConfig.multiInstance" key="multiInstance">
        <div slot="title" class="panel-tab__title"><i class="el-icon-s-help"></i>多实例</div>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="listeners" v-if="showConfig.listeners" key="listeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>执行监听器</div>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="taskListeners" v-if="showConfig.taskListeners" key="taskListeners">
        <div slot="title" class="panel-tab__title"><i class="el-icon-message-solid"></i>任务监听器</div>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="extensions" v-if="showCoinfg.extensions" key="extensions">
        <div slot="title" class="panel-tab__title"><i class="el-icon-circle-plus"></i>扩展属性</div>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item> -->
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from "./property/base/ElementBaseInfo";
import ReceiveTask from "./property/task/ReceiveTask";
import ScriptTask from "./property/task/ScriptTask";
import UserTask from "./property/task/UserTask";

import ElementMultiInstance from "./property/multi-instance/ElementMultiInstance";
import FlowCondition from "./property/flow-condition/FlowCondition";
// import SignalAndMassage from "./signal-message/SignalAndMessage";
import ElementListeners from "./property/listeners/ElementListeners";
import ElementProperties from "./property/properties/ElementProperties";
// import ElementForm from "./property/form/ElementForm";
import UserTaskListeners from "./property/listeners/UserTaskListeners";
import CandidateUsers from "./property/candidateUsers/CandidateUsers";
import ElementFormUrl from "./property/formUrl/ElementFormUrl";
import InOut from "./property/inOut/InOut";
import { NodeName } from "../../package/process-designer/plugins/translate/zh";
import showConfig from '../common/showConfig'
import { ComponentName } from '../common/showConfig'

/**
 * 侧边栏
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    UserTaskListeners,
    // ElementForm,
    ElementProperties,
    ElementListeners,
    // SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ReceiveTask,
    ScriptTask,
    UserTask,
    ElementBaseInfo,
    CandidateUsers,
    ElementFormUrl,
    InOut
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
      activeTab: "ElementBaseInfo",
      elementId: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false, // 表单配置
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
        this.element = null
        this.$nextTick(() => (this.element = element))
      });

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
            console.log(element);
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
            console.log(element);
            this.$nextTick().then(() => {
            this.element = element
          })
        }
      })
    },
    // 初始化数据
    // initFormOnChanged(element) {
    //   let activatedElement = element;
    //   if (!activatedElement) {
    //     activatedElement =
    //       window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
    //       window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
    //   }
    //   if (!activatedElement) return;
    //   console.log(`
    //           ----------
    //   select element changed:
    //             id:  ${activatedElement.id}
    //           type:  ${activatedElement.businessObject.$type}
    //           ----------
    //           `);
    //   console.log("businessObject: ", activatedElement.businessObject);
    //   window.bpmnInstances.bpmnElement = activatedElement;
    //   this.bpmnElement = activatedElement;
    //   this.elementId = activatedElement.id;
    //   this.elementType = activatedElement.type.split(":")[1];
    //   this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
    //   this.conditionFormVisible = !!(
    //     this.elementType === "SequenceFlow" &&
    //     activatedElement.source &&
    //     activatedElement.source.type.indexOf("StartEvent") === -1
    //   );
    //   this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
    // },
    // beforeDestroy() {
    //   window.bpmnInstances = null;
    // },
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
