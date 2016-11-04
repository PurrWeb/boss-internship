import React, { Component } from "react"
import _ from "underscore"

export default class AddShiftButton extends Component {
    static PropTypes = {
        addShift: React.PropTypes.func.isRequired,
        canAddShift: React.PropTypes.bool.isRequired
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
