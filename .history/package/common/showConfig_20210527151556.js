export default {
  'bpmn:Process': {
    components: ['BaseInfo','FormUrl'],
    processCategory: true,
    versionTag: false,
    documentation:true
  },
  'bpmn:EndEvent': {
    components: ['BaseInfo']
  },
  'bpmn:StartEvent': {
    components: ['BaseInfo'],
    initiator: true,
    formKey: true
  },
  'bpmn:UserTask': {
    components: ['BaseInfo','FormUrl','UserTask','CandidateUsers','MultiInstance','TaskListener','ExecutionListener'],
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
    components: ['BaseInfo','InOut','MultiInstance','CallActivity'],
    processInstanceName: true,
    calledElement: true,
    inOutParameters: true,
    businessKey: true,
    documentation:true
  },
  'bpmn:ServiceTask': {
    components: ['BaseInfo','ServiceTask','TaskListener','ExecutionListener'],
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true,
    documentation:true
  },
  'bpmn:ScriptTask': {
    components: ['BaseInfo','ScriptTask'],
    async: true,
    isForCompensation: true,
    autoStoreVariables: true,
    documentation:true
  },
  'bpmn:ManualTask': {
    components: ['BaseInfo'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:ReceiveTask': {
    components: ['BaseInfo','ReceiveTask'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:SendTask': {
    components: ['BaseInfo','SendTask'],
    async: true,
    isForCompensation: true,
    documentation:true
  },
  'bpmn:BusinessRuleTask': {
    components: ['BaseInfo','BusinessRuleTask'],
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true,
    documentation:true
  },
  'bpmn:SequenceFlow': {
    components: ['BaseInfo','Condition']
  }
}

export const ComponentName = {
  'BaseInfo': {
    name: '基本信息',
    icon: 'el-icon-info'
  },
  'UserTask': {
    name: '任务属性',    
    icon: 'el-icon-s-order'
  },
  'ServiceTask': {
    name: '任务属性',    
    icon: 'el-icon-s-order'
  },
  'ReceiveTask': {
    name: '任务属性',
    icon: ''
  },
  'MultiInstance': {
    name: '多实例',  
    icon: 'el-icon-s-cooperation'
  },
  'CandidateUsers': {
    name: '节点人员', 
    icon: 'el-icon-user-solid'
  },
  'FormUrl':{
    name:  '表单Url',
    icon: 'el-icon-s-order'
  },
  'InOut':{
    name:  '输入/输出',   
    icon: 'el-icon-s-help'
  },
  'Condition':{
    name:  '流转条件',   
    icon: 'el-icon-s-help'
  },
  'CallActivity':{
    name: '子流程',
    icon: 'el-icon-share'
  },
  'TaskListener':{
    name: '任务监听器',
    icon: 'el-icon-message-solid'
  },
  'ExecutionListener':{
    name: '执行监听器',
    icon: 'el-icon-message-solid'
  }

}
