<template>
  <div class="my-process-designer">
    <div class="my-process-designer__header">
      <slot name="control-header"></slot>
      <template v-if="!$slots['control-header']">
        <div style="display: flex; padding: 10px 0px; justify-content: space-between;">
          <div style="margin-left: 10px; display:inline-block;">
            <el-button-group key="file-control">
              <el-tooltip effect="light" content="加载文件" placement="bottom">
                <el-button :size="headerButtonSize" icon="el-icon-folder-opened" @click="$refs.refFile.click()" />
              </el-tooltip>
              <el-tooltip effect="light" content="新建">
                <el-button :size="headerButtonSize" icon="el-icon-refresh" @click="processRestart" />
              </el-tooltip>
            </el-button-group>
            <el-button-group key="scale-control">
              <el-tooltip effect="light" content="自适应屏幕">
                <el-button :size="headerButtonSize" icon="el-icon-rank" @click="processReZoom()" />
              </el-tooltip>
              <el-tooltip effect="light" content="缩小">
                <el-button :size="headerButtonSize" :disabled="defaultZoom < 0.2" icon="el-icon-zoom-out" @click="processZoomOut()" />
              </el-tooltip>
              <el-button :size="headerButtonSize">{{ Math.floor(this.defaultZoom * 10 * 10) + "%" }}</el-button>
              <el-tooltip effect="light" content="放大">
                <el-button :size="headerButtonSize" :disabled="defaultZoom > 4" icon="el-icon-zoom-in" @click="processZoomIn()" />
              </el-tooltip>
            </el-button-group>
            <el-button-group key="stack-control">
              <el-tooltip effect="light" content="撤销">
                <el-button :size="headerButtonSize" :disabled="!revocable" icon="el-icon-refresh-left" @click="processUndo()" />
              </el-tooltip>
              <el-tooltip effect="light" content="恢复">
                <el-button :size="headerButtonSize" :disabled="!recoverable" icon="el-icon-refresh-right" @click="processRedo()" />
              </el-tooltip>
            </el-button-group>
          </div>
          <div>
            <el-button-group key="file-control">
              <el-tooltip effect="light">
                <div slot="content">
                  <el-button :size="headerButtonSize" type="text" @click="previewProcessXML">预览XML</el-button>
                  <br />
                  <el-button :size="headerButtonSize" type="text" @click="previewProcessJson">预览JSON</el-button>
                </div>
                <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-view">预览</el-button>
              </el-tooltip>
              <el-tooltip effect="light">
                <div slot="content">
                  <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsXml()">下载XML</el-button>
                  <br />
                  <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsSvg()">下载SVG</el-button>
                  <br />
                  <el-button :size="headerButtonSize" type="text" @click="downloadProcessAsBpmn()">下载BPMN</el-button>
                </div>
                <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-download">下载文件</el-button>
              </el-tooltip>
              <el-tooltip v-if="simulation" effect="light" :content="this.simulationStatus ? '退出模拟' : '开启模拟'">
                <el-button :size="headerButtonSize" :type="headerButtonType" icon="el-icon-cpu" @click="processSimulation">
                  模拟
                </el-button>
              </el-tooltip>
              <el-button size="mini" icon="el-icon-check" type="primary" @click="openSubmitDialog">提交</el-button>
            </el-button-group>
          </div>
        </div>
      </template>
      <!-- 用于打开本地文件-->
      <input type="file" id="files" ref="refFile" style="display: none" accept=".xml, .bpmn" @change="importLocalFile" />
    </div>
    <div class="my-process-designer__container">
      <div class="my-process-designer__canvas" ref="bpmn-canvas"></div>
    </div>
    <el-dialog :visible.sync="previewModelVisible" title="预览" :fullscreen="false" top="10vh">
      <vue-ace-editor
        v-model="previewResult"
        :lang="previewType"
        theme="chrome"
        width="100%"
        height="500"
        :options="{ wrap: true, readOnly: true }"
        @init="editorInit"
      />
      <span slot="footer" class="dialog-footer">
        <el-button v-clipboard:copy="previewResult" v-clipboard:success="onCopy" icon="el-icon-document" type="primary">复 制</el-button>
        <el-button icon="el-icon-close" @click="previewModelVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <submit-dialog
      :submitDialogFlag.sync="submitDialogFlag"
      :deployed="Boolean(processDefinitionId)"
      @submit="submit"
    />
  </div>
</template>

<script>
// 生产环境时优化
// const BpmnModeler = window.BpmnJS;
import BpmnModeler from "bpmn-js/lib/Modeler";
import DefaultEmptyXML from "./plugins/defaultEmpty";
// 翻译方法
import customTranslate from "./plugins/translate/customTranslate";
import translationsCN from "./plugins/translate/zh";
// 模拟流转流程
import tokenSimulation from "bpmn-js-token-simulation";
// 标签解析构建器
// import bpmnPropertiesProvider from "bpmn-js-properties-panel/lib/provider/bpmn";
// 标签解析 Moddle
import flowableModdleDescriptor from "./plugins/descriptor/flowableDescriptor.json";
import flowableModdleExtension from "./plugins/extension-moddle/flowable";
// 引入json转换与高亮
import convert from "xml-js";
// 预览编辑器
import VueAceEditor from "vue2-ace-editor";
import { getXmlByModelId, getXmlByDefId, submitModel } from '../api/api'
import SubmitDialog from "./SubmitDialog";

export default {
  name: "MyProcessDesigner",
  componentName: "MyProcessDesigner",
  components: {
    VueAceEditor,
    SubmitDialog
  },
  props: {
    processId: String,
    processName: String,
    translations: Object, // 自定义的翻译文件
    additionalModel: [Object, Array], // 自定义model
    moddleExtension: Object, // 自定义moddle
    onlyCustomizeAddi: {
      type: Boolean,
      default: false
    },
    onlyCustomizeModdle: {
      type: Boolean,
      default: false
    },
    simulation: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    prefix: {
      type: String,
      default: "camunda"
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    },
    headerButtonSize: {
      type: String,
      default: "small",
      validator: value => ["default", "medium", "small", "mini"].indexOf(value) !== -1
    },
    headerButtonType: {
      type: String,
      default: "default",
      validator: value => ["default", "primary", "success", "warning", "danger", "info"].indexOf(value) !== -1
    }
  },
  data() {
    return {
      value: '', // xml 字符串
      defaultZoom: 1,
      previewModelVisible: false,
      simulationStatus: false,
      previewResult: "",
      previewType: "xml",
      recoverable: false,
      revocable: false,
      submitDialogFlag: false,
      modelId: "",
      processDefinitionId: ""
    };
  },
  watch: {
    value: function(val) {
      this.createNewDiagram(val)
    },
    modelId: function(val) {
      if (val) {
        getXmlByModelId(val).then(resp => {
          if (resp) {
            this.value = resp
          } else {
            this.createNewDiagram(null);
          }
        }).catch(err=>{
          this.createNewDiagram(null);
        });
      }
    },
    processDefinitionId: function(val) {
      if (val) {
        getXmlByDefId(val).then(resp => {
          if (resp) {
            this.value = resp
          } else {
            this.createNewDiagram(null);
          }
        }).catch(err=>{
          this.createNewDiagram(null);
        });
      }
    }
  },
  mounted() {
    this.initBpmnModeler();
    this.modelId = document.getElementById('modelId').value ?? null
    this.processDefinitionId = document.getElementById('processDefinitionId').value ?? null
    if(!this.modelId && !this.processDefinitionId){
      this.createNewDiagram(this.value);
    }
    this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  },
  computed: {
    additionalModules() {
      const Modules = [];
      // 仅保留用户自定义扩展模块
      if (this.onlyCustomizeAddi) {
        if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
          return this.additionalModel || [];
        }
        return [this.additionalModel];
      }

      // 插入用户自定义扩展模块
      if (Object.prototype.toString.call(this.additionalModel) === "[object Array]") {
        Modules.push(...this.additionalModel);
      } else {
        this.additionalModel && Modules.push(this.additionalModel);
      }

      // 翻译模块
      const TranslateModule = {
        translate: ["value", customTranslate(this.translations || translationsCN)]
      };
      Modules.push(TranslateModule);

      // 模拟流转模块
      if (this.simulation) {
        Modules.push(tokenSimulation);
      }

      // 根据需要的流程类型设置扩展元素构建模块
      // if (this.prefix === "bpmn") {
      //   Modules.push(bpmnModdleExtension);
      // }

      if (this.prefix === "flowable") {
        Modules.push(flowableModdleExtension);
      }
      return Modules;
    },
    moddleExtensions() {
      const Extensions = {};
      // 仅使用用户自定义模块
      if (this.onlyCustomizeModdle) {
        return this.moddleExtension || null;
      }

      // 插入用户自定义模块
      if (this.moddleExtension) {
        for (let key in this.moddleExtension) {
          Extensions[key] = this.moddleExtension[key];
        }
      }
      if (this.prefix === "flowable") {
        Extensions.flowable = flowableModdleDescriptor;
      }
      return Extensions;
    }
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules,
        moddleExtensions: this.moddleExtensions
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async event => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("commandStack-changed", event);
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }) => {
        this.$emit("canvas-viewbox-changed", { viewbox });
        const { scale } = viewbox;
        this.defaultZoom = Math.floor(scale * 100) / 100;
      });
    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`;
      let newName = this.processName || `业务流程_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        this.processReZoom();
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn));
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`);
      }
    },
    async saveXML() {
      const { err, xml } = await this.bpmnModeler.saveXML({ format: true });
      // 读取异常时抛出异常
      if (err) {
        console.error(`[Process Designer Warn ]: ${err.message || err}`);
      }
      return xml;
    },
    // 下载流程图到本地
    async downloadProcess(type) {
      let name = this.getProcessElement().name;
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const xml = await this.saveXML();
          let { href, filename } = _this.setEncoded(type.toUpperCase(), name, xml);
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", name, svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },

    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
        data: data
      };
    },

    // 加载本地文件
    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    /* ------------------------------------------------ refs methods ------------------------------------------------------ */
    downloadProcessAsXml() {
      this.downloadProcess("xml");
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
    downloadProcessAsSvg() {
      this.downloadProcess("svg");
    },
    processSimulation() {
      this.simulationStatus = !this.simulationStatus;
      this.simulation && this.bpmnModeler.get("toggleMode").toggleMode();
    },
    processRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
    },
    processZoomTo(newZoom = 1) {
      if (newZoom < 0.2) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be less than 0.2");
      }
      if (newZoom > 4) {
        throw new Error("[Process Designer Warn ]: The zoom ratio cannot be greater than 4");
      }
      this.defaultZoom = newZoom;
      this.bpmnModeler.get("canvas").zoom(newZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
    },
    processRestart() {
      this.recoverable = false;
      this.revocable = false;
      this.createNewDiagram(null).then(() => this.bpmnModeler.get("canvas").zoom(1, "auto"));
    },
    /*-----------------------------    方法结束     ---------------------------------*/
    previewProcessXML() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = xml;
        this.previewType = "xml";
        this.previewModelVisible = true;
      });
    },
    previewProcessJson() {
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.previewResult = convert.xml2json(xml, { spaces: 2 });
        this.previewType = "json";
        this.previewModelVisible = true;
      });
    },
    editorInit() {
      require("brace/ext/language_tools");
      require("brace/mode/xml");
      require("brace/mode/json");
      require("brace/theme/chrome");
    },
    onCopy() {
      this.$message.success("内容复制成功");
    },
    openSubmitDialog() {
      this.submitDialogFlag = true;
    },
    async submit(data) {
      data.xml = await this.saveXML()
      data.id = this.modelId
      data.processDefinitionId = this.processDefinitionId
      submitModel(data).then((rsp) => {
        if (rsp !== false) {
          this.submitDialogFlag = false
          this.$emit('submitSuccess')
        }
      })
    },
    getProcessElement() {
      const rootElements = this.bpmnModeler.getDefinitions().rootElements;
      for (let i = 0; i < rootElements.length; i++) {
        if (rootElements[i].$type === "bpmn:Process") return rootElements[i];
      }
    }
  }
};
</script>
