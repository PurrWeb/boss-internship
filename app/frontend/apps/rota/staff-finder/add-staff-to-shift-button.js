import React, { Component } from "react"
import _ from "underscore"

export default class AddStaffToShiftButton extends Component {
    static contextTypes = {
        canAddShift: React.PropTypes.bool.isRequired
    }
    static PropTypes = {
        addShift: React.PropTypes.func.isRequired,
        staffid: React.PropTypes.number.isRequired
    }
    componentDidMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        var className = "btn btn-default";
        if (!this.context.canAddShift) {
            className += " disabled";
        }

        return <a
                className={className}
                onClick={() => this.onClick()}>
                Add shift
            </a>
    }
    onClick() {
        if (!this.context.canAddShift) {
            return;
        }
        this.props.addShift();
    }
}
