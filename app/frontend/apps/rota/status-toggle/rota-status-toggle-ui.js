import PropTypes from 'prop-types';
import React from "react"
import ComponentErrors from "~/components/component-errors"
import rotaStatusTitles from "~/lib/rota-status-titles"
import Spinner from "~/components/spinner"
import RotaStatusDropdown from "./rota-status-dropdown"

export default class RotaStatusToggleUi extends React.Component {
    static propTypes = {
        status: PropTypes.string.isRequired,
        onStatusSelected: PropTypes.func.isRequired,
        errorMessages: PropTypes.object,
        statusUpdateInProgress: PropTypes.bool
    }
    render(){
        var statusIfPublished = null;
        if (this.props.status === "published"){
            statusIfPublished = rotaStatusTitles[this.props.status];
        }
        return <div>
            <label>Rota Status: {statusIfPublished}</label>
            {this.getDropdown()}
            {this.getUpdateInProgressSpinner()}
            <ComponentErrors errors={this.props.errorMessages} />
        </div>
    }
    getDropdown(){
        if (this.props.statusUpdateInProgress) {
            return null;
        }
        if (this.props.status === "published") {
            return null;
        }
        return <RotaStatusDropdown
            statuses={["in_progress", "finished"]}
            selectedStatus={this.props.status}
            onChange={(status) => this.props.onStatusSelected(status)} />
    }
    getUpdateInProgressSpinner(){
        if (!this.props.statusUpdateInProgress) {
            return null;
        }
        return <Spinner />
    }
}