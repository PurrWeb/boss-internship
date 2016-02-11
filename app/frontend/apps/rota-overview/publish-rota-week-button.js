import React from "react"

export default class PublishRotaWeekButton extends React.Component {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        hasBeenPublished: React.PropTypes.bool.isRequired
    }
    render(){
        if (this.props.hasBeenPublished) {
            return <div>
                "This week's rotas have been published. Changes to it will send out email notifications."
            </div>
        } else {
            return <button className="btn btn-default" onClick={this.props.onClick}>
                Publish this week's rotas
            </button>
        }
    }
}