import PropTypes from 'prop-types';
import React from "react"
import { connect } from "react-redux"
import _ from "underscore"
import PublishRotaWeekButton from "./publish-rota-week-button"
import actionCreators from "~/redux/actions"

const ROTA_PUBLISHED_STATUS = "published"

class PublishRotaWeekButtonContainer extends React.Component {
    static propTypes = {
        rotas: PropTypes.array.isRequired,
        firstDate: PropTypes.instanceOf(Date).isRequired,
        lastDate: PropTypes.instanceOf(Date).isRequired,
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
            dispatch(actionCreators().publishRotas({
                venueServerId: ownProps.rotas[0].venue.serverId,
                date: ownProps.firstDate
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishRotaWeekButtonContainer)
