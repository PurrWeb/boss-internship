import React from "react"
import * as actionCreators from "~redux/actions"
import RotaStatusToggleUi from "./rota-status-toggle-ui"
import { connect } from "react-redux"

class RotaStatusToggle extends React.Component {
    static propTypes = {
        status: React.PropTypes.string.isRequired
    }
    render(){
        return <RotaStatusToggleUi
            status={this.props.status}
            nextStatus={this.props.nextStatus}
            onNextStatusClick={() => this.onNextStatusClick()} />
    }
    onNextStatusClick(){
        this.props.updateToNextStatus({
            rotaId: this.props.rota.id,
            status: this.props.nextStatus
        })
    }
}

function getNextStatus(status){
    return {
        in_progress: "finished",
        finished: "in_progress",
        published: null
    }[status]
}

function mapStateToProps(state){
    var rota = state.rotas[state.pageOptions.displayedRota];
    return {
        rota: rota,
        status: rota.status,
        nextStatus: getNextStatus(rota.status)
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        updateToNextStatus: function(options){
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