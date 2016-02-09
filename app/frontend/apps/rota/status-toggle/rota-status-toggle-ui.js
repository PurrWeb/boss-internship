import React from "react"
import NextRotaStatusButton from "./next-rota-status-button"
import ComponentErrors from "~components/component-errors"
import rotaStatusTitles from "~lib/rota-status-titles"
import Spinner from "~components/spinner"

export default class RotaStatusToggleUi extends React.Component {
    static propTypes = {
        status: React.PropTypes.string.isRequired,
        // next status, or null if status can't be changed
        nextStatus: React.PropTypes.string,
        onNextStatusClick: React.PropTypes.func.isRequired,
        errorMessages: React.PropTypes.object,
        statusUpdateInProgress: React.PropTypes.bool
    }
    render(){
        return <div>
            <div className="row" style={{maxWidth: 250}}>
                <div className="col-md-6">
                    <div className="rota-status-toggle__status">
                        {rotaStatusTitles[this.props.status]}
                    </div>
                </div>
                <div className="col-md-6">
                    {this.getNextStatusButton()}
                    {this.getUpdateInProgressSpinner()}
                </div>
            </div>
            <ComponentErrors errors={this.props.errorMessages} />
        </div>
    }
    getNextStatusButton(){
        if (this.props.statusUpdateInProgress) {
            return null;
        }
        return <NextRotaStatusButton nextStatus={this.props.nextStatus} onClick={this.props.onNextStatusClick} />;
    }
    getUpdateInProgressSpinner(){
        if (!this.props.statusUpdateInProgress) {
            return null;
        }
        return <Spinner />
    }
}