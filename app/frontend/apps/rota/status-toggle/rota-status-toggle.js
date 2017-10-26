import PropTypes from 'prop-types';
import React from "react"
import actionCreators from "~/redux/actions"
import RotaStatusToggleUi from "./rota-status-toggle-ui"
import { connect } from "react-redux"
import _ from "underscore"
import { selectRotaOnVenueRotaPage } from "~/redux/selectors"
import oFetch from "o-fetch"

class RotaStatusToggle extends React.Component {
    static propTypes = {
        status: PropTypes.string.isRequired
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
            venueServerId: this.props.rota.venue.serverId,
            venueClientId: this.props.rota.venue.clientId,
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
            (request) => request.venueServerId === rota.venue.get(state.venues).serverId
        )
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        updateStatus: function(options){
            dispatch(actionCreators().updateRotaStatus(options));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {withRef: true}
)(RotaStatusToggle)
