import React from "react"
import Spinner from "~components/spinner"

export default class PublishRotaWeekButton extends React.Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        hasBeenPublished: React.PropTypes.bool.isRequired,
        publishingInProgress: React.PropTypes.bool.isRequired
    }
    render(){
        if (this.props.hasBeenPublished) {
            return <div className="alert alert-info">
                This week's rotas have been published.
                <br/>
                Changes to them will send out email notifications.
            </div>
        } else {
            if (this.props.publishingInProgress) {
                return <Spinner />
            } else {
                return <button className="btn btn-default" onClick={this.props.onClick}>
                    Publish this week's rotas
                </button>
            }
        }
    }
}