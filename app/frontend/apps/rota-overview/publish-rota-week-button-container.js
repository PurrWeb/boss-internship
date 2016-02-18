import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import PublishRotaWeekButton from "./publish-rota-week-button"
import { publishRotas } from "~redux/actions"

const ROTA_PUBLISHED_STATUS = "published"

class PublishRotaWeekButtonContainer extends React.Component {
    static propTypes = {
        rotas: React.PropTypes.array.isRequired,
        firstDate: React.PropTypes.instanceOf(Date).isRequired,
        lastDate: React.PropTypes.instanceOf(Date).isRequired,
    }
    render(){
        var hasBeenPublished = this.props.rotas[0].status === ROTA_PUBLISHED_STATUS;

        return <PublishRotaWeekButton
            hasBeenPublished={hasBeenPublished}
            publishingInProgress={this.props.publishingInProgress}
            onClick={() => this.props.publishRotaWeek()} />
    }
}

function mapStateToProps(state){
    return {
        publishingInProgress: _.some(state.apiRequestsInProgress.PUBLISH_ROTAS)
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        publishRotaWeek: function(){
            dispatch(publishRotas({
                venueId: ownProps.rotas[0].venue.id,
                date: ownProps.firstDate
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishRotaWeekButtonContainer)