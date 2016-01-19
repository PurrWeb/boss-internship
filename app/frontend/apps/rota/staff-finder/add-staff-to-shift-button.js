import React, { Component } from "react"
import _ from "underscore"

export default class AddStaffToShiftButton extends Component {
    static contextTypes = {
        addShift: React.PropTypes.func,
        canAddShift: React.PropTypes.bool,
        componentErrors: React.PropTypes.object
    }
    componentDidMount(){
        this.componentId = _.uniqueId();
    }
    render() {
        var className = "btn btn-default";
        if (!this.context.canAddShift) {
            className += " disabled";
        }

        var errorMessages = this.context.componentErrors[this.componentId];
        errorMessages = JSON.stringify(errorMessages);

        return <div>
            <a
                className={className}
                onClick={() => this.onClick()}>
                Add shift
            </a>
            {errorMessages}
        </div>
    }
    onClick() {
        if (!this.context.canAddShift) {
            return;
        }
        this.context.addShift(this.props.staffId, this.componentId);
    }
}
