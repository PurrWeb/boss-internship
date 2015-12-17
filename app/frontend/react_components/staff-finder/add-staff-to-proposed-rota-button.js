import React, { Component } from "react"
import { boundActionCreators } from "../../redux/store.js"
import _ from "underscore"

export default class AddStaffToProposedRotaButton extends Component {
    render() {
        var className = `btn ${this.staffIsInProposedRotaList() ? "btn-success": "btn-default"}`;
        return <a className={className} onClick={() => this.onClick()}>
            {this.staffIsInProposedRotaList() ? "Remove from assignment" : "Add to assignment"}
        </a>
    }
    staffIsInProposedRotaList(){
        return _(this.props.proposedRotaStaff).contains(this.props.staffId);
    }
    onClick() {
        if (this.staffIsInProposedRotaList()) {
            boundActionCreators.removeStaffFromProposedRota(this.props.staffId);
        } else {
            boundActionCreators.addStaffToProposedRota(this.props.staffId);
        }
    }
}
