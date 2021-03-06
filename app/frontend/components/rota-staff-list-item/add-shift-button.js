import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"

export default class AddShiftButton extends Component {
    static PropTypes = {
        addShift: PropTypes.func.isRequired,
        canAddShift: PropTypes.bool.isRequired
    }
    render() {
        var className = "boss2-button boss2-button_type_small boss2-button_role_add ";
        if (!this.props.canAddShift) {
            className += " disabled";
        }

        return <a
                className={className}
                onClick={() => this.onClick()}
                style={{whiteSpace: 'nowrap'}}
        >
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
