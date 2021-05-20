export default {
  'bpmn:Process': {
    components: ['ElementBaseInfo','ElementFormUrl'],
    processCategory: true,
    versionTag: false,
    documentation:true
  },
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    components: ['ElementBaseInfo'],
    initiator: true,
    formKey: true
  },
  'bpmn:UserTask': {
    components: ['ElementBaseInfo','ElementFormUrl','UserTask','CandidateUsers','ElementMultiInstance','TaskListeners'],
    userType: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    async: true,
    priority: true,
    formKey: true,
    skipExpression: true,
    completeAutoExpression: true,
    dueDate: true,
    taskListener: true,
    pcUrl: true,
    mobileUrl: true,
    pcInfoUrl: true,
    mobileInfoUrl: true,
    documentation:true
  },
  'bpmn:CallActivity': {
    components: ['ElementBaseInfo','InOut','ElementMultiInstance','CallActivity'],
    processInstanceName: true,
    calledElement: true,
    inOutParameters: true,
    businessKey: true,
    documentation:true
  },
  'bpmn:ServiceTask': {
    components: ['ElementBaseInfo','ServiceTask'],
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true,
    documentation:true
  },
  'bpmn:ScriptTask': {
    components: ['ElementBaseInfo','ScriptTask'],
    async: true,
    isForCompensation: true,
    autoStoreVariables: true,
    documentation:true
  },
  'bpmn:ManualTask': {
    components: ['ElementBaseInfo','ManualTask'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:ReceiveTask': {
    components: ['ElementBaseInfo','ReceiveTask'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:SendTask': {
    components: ['ElementBaseInfo','SendTask'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:BusinessRuleTask': {
    components: ['ElementBaseInfo','BusinessRuleTask'],
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true,
    documentation:true
  },
  'bpmn:SequenceFlow': {
    components: ['ElementBaseInfo','FlowCondition']
  }
}

export const ComponentName = {
  'ElementBaseInfo': {
    name: '基本信息',
    icon: 'el-icon-info'
  },
  'UserTask': {
    name: '任务属性',    
    icon: ''
  },
  'ServiceTask': {
    name: '任务属性',    
    icon: ''
  },
  'ReceiveTask': {
    name: '任务属性',
    icon: ''
  },
  'ElementMultiInstance': {
    name: '多实例',  
    icon: 'el-icon-s-cooperation'
  },
  'CandidateUsers': {
    name: '节点人员', 
    icon: 'el-icon-user-solid'
  },
  'ElementFormUrl':{
    name:  '表单Url',
    icon: 'el-icon-s-order'
  },
  'InOut':{
    name:  '输入/输出',   
    icon: 'el-icon-s-help'
  },
  'FlowCondition':{
    name:  '流转条件',   
    icon: 'el-icon-s-help'
  },
  'CallActivity':{
    name: '子流程',
    icon: 'el-icon-share'
  },
  'TaskListeners':{
    name: '任务监听器',
    icon: 'el-icon-view'
  }

}
