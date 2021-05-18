import request from './request'

export function getXmlByModelId(modelId) {
  return request({
    url: '/flow/model/xml/' + modelId,
    method: 'get'
  })
}

export function getXmlByDefId(defId) {
  return request({
    url: '/flow/def/xml/' + defId,
    method: 'get'
  })
}

export function submitModel(data) {
  return request({
    url: '/flow/model/submitModel',
    data: data,
    method: 'post'
  })
}

/**
 * 类别列表
 */
export function getCategoryList() {
  return request({
    url: '/flow/category/list',
    method: 'get'
  })
}

/**
 * 候选人类型列表
 */
export function getCandidatesTypeList() {
  return request({
    url: '/flow/model/candidatesTypeList',
    method: 'get'
  })
}

/**
* 保存模型
*/
export function saveMode() {
  return request({
    url: '/flow/model/add',
    method: 'post'
  })
}
