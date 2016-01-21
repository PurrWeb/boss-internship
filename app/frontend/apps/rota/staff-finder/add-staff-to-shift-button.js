import React, { Component } from "react"
import _ from "underscore"

export default class AddStaffToShiftButton extends Component {
    static contextTypes = {
        canAddShift: React.PropTypes.func.isRequired
    }
    static PropTypes = {
        addShift: React.PropTypes.func.isRequired,
        staffId: React.PropTypes.number.isRequired
    }
    componentDidMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        var className = "btn btn-default";
        if (!this.canAddShift()) {
            className += " disabled";
        }

        return <a
                className={className}
                onClick={() => this.onClick()}>
                Add shift
            </a>
    }
    canAddShift(){
        return this.context.canAddShift(this.props.staffId)
    }
    onClick() {
        if (!this.canAddShift()) {
            return;
        }
        this.props.addShift();
    }
}
