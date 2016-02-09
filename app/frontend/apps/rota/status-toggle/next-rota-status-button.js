import React from "react"
import rotaStatusTitles from "~lib/rota-status-titles"

const actionCTAs = {
    "in_progress": "Revert to " + rotaStatusTitles.in_progress,
    "finished": "Mark as " + rotaStatusTitles.finished
}

export default class NextRotaStatusButton extends React.Component {
    static propTypes = {
        nextStatus: React.PropTypes.string,
        onClick: React.PropTypes.func
    }
    render(){
        if (!this.props.nextStatus) {
            return null;
        }
        return <a className="btn btn-primary next-rota-status-button" onClick={this.props.onClick}>
            {this.getActionText()}
        </a>
    }
    getActionText(){
        return actionCTAs[this.props.nextStatus];
    }
}