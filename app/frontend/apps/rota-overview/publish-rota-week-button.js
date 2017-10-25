import PropTypes from 'prop-types';
import React from "react"
import Spinner from "~/components/spinner"

export default class PublishRotaWeekButton extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        hasBeenPublished: PropTypes.bool.isRequired,
        publishingInProgress: PropTypes.bool.isRequired
    }
    render(){
        if (this.props.hasBeenPublished) {
            return <div className="callout">
                This week's rotas have been published.
                <br/>
                Changes to them will send out email notifications.
            </div>
        } else {
            if (this.props.publishingInProgress) {
                return <Spinner />
            } else {
                return <button className="boss2-button" onClick={this.props.onClick}>
                    Publish this week's rotas
                </button>
            }
        }
    }
}  