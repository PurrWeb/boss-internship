import React from "react"
import NextRotaStatusButton from "./next-rota-status-button"
import ComponentErrors from "~components/component-errors"
import rotaStatusTitles from "~lib/rota-status-titles"

export default class RotaStatusToggleUi extends React.Component {
    static propTypes = {
        status: React.PropTypes.string.isRequired,
        // next status, or null if status can't be changed
        nextStatus: React.PropTypes.string,
        onNextStatusClick: React.PropTypes.func.isRequired,
        errorMessages: React.PropTypes.object
    }
    render(){
        return <div>
            <div className="rota-status-toggle__status">
                {rotaStatusTitles[this.props.status]}
            </div>
            <NextRotaStatusButton nextStatus={this.props.nextStatus} />
            <ComponentErrors errors={this.props.errorMessages} />
        </div>
    }
}