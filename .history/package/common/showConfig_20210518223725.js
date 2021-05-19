export default {
  'bpmn:Process': {
    components: ['ElementFormUrl'],
    processCategory: true,
    versionTag: false
  },
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    components: [],
    initiator: true,
    formKey: true
  },
  'bpmn:UserTask': {
    components: ['ElementFormUrl','UserTask','CandidateUsers'],
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
    mobileInfoUrl: true
  },
  'bpmn:CallActivity': {
    components: ['InOut'],
    processInstanceName: true,
    calledElement: true,
    inOutParameters: true,
    businessKey: true
  },
  'bpmn:ServiceTask': {
    components: ['ServiceTask'],
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true
  },
  'bpmn:ScriptTask': {
    components: ['ScriptTask'],
    async: true,
    isForCompensation: true,
    autoStoreVariables: true
  },
  'bpmn:ManualTask': {
    components: ['ManualTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:ReceiveTask': {
    components: ['ReceiveTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:SendTask': {
    components: ['SendTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    components: ['BusinessRuleTask'],
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true
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
    name:  '表单信息',
    icon: 'el-icon-s-order'
  },
  'InOut':{
    name:  '输入/输出',   
    icon: 'el-icon-s-help'
  }

}
