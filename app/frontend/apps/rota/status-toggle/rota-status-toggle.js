import React from "react"
import * as actionCreators from "~redux/actions"
import RotaStatusToggleUi from "./rota-status-toggle-ui"
import { connect } from "react-redux"
import _ from "underscore"
import { selectRotaOnVenueRotaPage } from "~redux/selectors"
import oFetch from "o-fetch"

class RotaStatusToggle extends React.Component {
    static propTypes = {
        status: React.PropTypes.string.isRequired
    }
    render(){
        return <RotaStatusToggleUi
            status={this.props.status}
            nextStatus={this.props.nextStatus}
            onStatusSelected={(status) => this.setStatus(status)}
            statusUpdateInProgress={this.props.statusUpdateInProgess} />
    }
    setStatus(status){
        this.props.updateStatus({
            venueId: this.props.rota.venue.id,
            date: this.props.rota.date,
            status: status
        })
    }
}

function mapStateToProps(state){
    var rota = selectRotaOnVenueRotaPage(state);
    return {
        rota: rota,
        status: oFetch(rota, "status"),
        statusUpdateInProgess: _.some(
            state.apiRequestsInProgress.UPDATE_ROTA_STATUS,
            (request) => request.rotaId === rota.id
        )
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        updateStatus: function(options){
            dispatch(actionCreators.updateRotaStatus(options));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {withRef: true}
)(RotaStatusToggle)