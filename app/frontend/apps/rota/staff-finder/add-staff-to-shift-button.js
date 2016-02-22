import React, { Component } from "react"
import _ from "underscore"

export default class AddStaffToShiftButton extends Component {
    static PropTypes = {
        addShift: React.PropTypes.func.isRequired,
        staffId: React.PropTypes.number.isRequired,
        canAddShift: React.PropTypes.bool.isRequired
    }
    componentDidMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        var className = "btn btn-default";
        if (!this.props.canAddShift) {
            className += " disabled";
        }

        return <a
                className={className}
                onClick={() => this.onClick()}>
                Add shift
            </a>
    }
    onClick() {
        if (!this.props.canAddShift) {
            return;
        }
        this.props.addShift();
    }
}
