export default {
  'bpmn:Process': {
    components: ['ElementBaseInfo','ElementFormUrl'],
    processCategory: true,
    versionTag: false
  },
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    components: ['ElementBaseInfo'],
    initiator: true,
    formKey: true
  },
  'bpmn:UserTask': {
    components: ['ElementBaseInfo','ElementFormUrl','UserTask','ElementMultiInstance','CandidateUsers'],
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
    components: ['ElementBaseInfo','ElementMultiInstance','InOut'],
    processInstanceName: true,
    calledElement: true,
    inOutParameters: true,
    businessKey: true
  },
  'bpmn:ServiceTask': {
    components: ['ElementBaseInfo','ServiceTask'],
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true
  },
  'bpmn:ScriptTask': {
    components: ['ElementBaseInfo','ScriptTask'],
    async: true,
    isForCompensation: true,
    autoStoreVariables: true
  },
  'bpmn:ManualTask': {
    components: ['ElementBaseInfo','ManualTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:ReceiveTask': {
    components: ['ElementBaseInfo','ReceiveTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:SendTask': {
    components: ['ElementBaseInfo','SendTask'],
    async: true,
    isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    components: ['ElementBaseInfo','BusinessRuleTask'],
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true
  }
}

export const ComponentName = {
  'ElementBaseInfo': '基本信息',
  'UserTask': '任务属性',
  'ServiceTask': '任务属性',
  'ReceiveTask': '任务属性',
  'ElementMultiInstance': '多实例',
  'CandidateUsers': '节点人员',
  'ElementFormUrl': '表单信息',
  'InOut': '输入/输出'

}
