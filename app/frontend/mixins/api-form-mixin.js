import React from "react"
import _ from "underscore"

export default {
    contextTypes: {
        componentErrors: React.PropTypes.object.isRequired
    },
    componentWillMount(){
        this.componentId = _.uniqueId();
    },
    getComponentId() {
        return this.componentId;
    },
    getComponentErrors(){
        return this.context.componentErrors[this.getComponentId()];
    }
}