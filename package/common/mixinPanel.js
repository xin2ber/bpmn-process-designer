import showConfig from './showConfig'

export default {
  props: {
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateProperties(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    },
    updateVal(key,val) {
      let properties = {}
      properties[key] = val || null
      this.updateProperties(properties)
    }
  },
  computed: {
    elementType() {
      const bizObj = this.element.businessObject
      return bizObj.eventDefinitions
        ? bizObj.eventDefinitions[0].$type
        : bizObj.$type
    },
    showConfig() {
      return showConfig[this.elementType] || {}
    }
  }
}