import React from "react"
import PublishRotaWeekButton from "./publish-rota-week-button"

const ROTA_PUBLISHED_STATUS = "published"

export default class PublishRotaWeekButtonContainer extends React.Component {
    static propTypes = {
        rotas: React.PropTypes.array.isRequired,
        firstDate: React.PropTypes.instanceOf(Date).isRequired,
        lastDate: React.PropTypes.instanceOf(Date).isRequired,
    }
    render(){
        var hasBeenPublished = this.props.rotas[0].status === ROTA_PUBLISHED_STATUS;

        return <PublishRotaWeekButton
            hasBeenPublished={hasBeenPublished}
            onClick={() => this.onClick()} />
    }
    onClick(){
        
    }
}