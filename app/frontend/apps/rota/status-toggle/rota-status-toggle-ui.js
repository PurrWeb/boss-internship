import React from "react"
import ComponentErrors from "~components/component-errors"
import rotaStatusTitles from "~lib/rota-status-titles"
import Spinner from "~components/spinner"
import RotaStatusDropdown from "./rota-status-dropdown"

export default class RotaStatusToggleUi extends React.Component {
    static propTypes = {
        status: React.PropTypes.string.isRequired,
        onStatusSelected: React.PropTypes.func.isRequired,
        errorMessages: React.PropTypes.object,
        statusUpdateInProgress: React.PropTypes.bool
    }
    render(){
        var statusIfPublished = null;
        if (this.props.status === "published"){
            statusIfPublished = rotaStatusTitles[this.props.status];
        }
        return <div>
            Rota Status: {statusIfPublished}
            <div style={{maxWidth: 300}}>
                {this.getDropdown()}
                {this.getUpdateInProgressSpinner()}
            </div>
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