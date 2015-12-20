import React, { Component } from "react"
import _ from "underscore"

export default class AddStaffToShiftButton extends Component {
    render() {
        var className = `btn btn-default`;
        return <a className={className} onClick={() => this.onClick()}>
            Add shift
        </a>
    }
    onClick() {
        this.props.addShift(this.props.staffId);
    }
}
