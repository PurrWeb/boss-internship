import React from "react"
import _ from "underscore"
import utils from "~/lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import actionCreators from "~/redux/actions"
import { selectUpdateRotaForecastInProgress, selectForecastByRotaId } from "~/redux/selectors"

class RotaForecast extends React.Component {
    static propTypes = {
        rotaClientId: React.PropTypes.any.isRequired,
        canEditForecastedTake: React.PropTypes.bool
    }
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
        this.state = {
            forecastedTake: utils.formatMoney(props.rotaForecast.forecasted_take_cents / 100)
        }
    }
    render(){
        return <RotaForecastUi
            rotaForecast={this.props.rotaForecast}
            forecastedTake={this.state.forecastedTake}
            canEditForecastedTake={this.props.canEditForecastedTake}
            onForecastedTakeChanged={(forecastedTake) => this.setState({forecastedTake})}
            onUpdateForecastClick={() => this.onUpdateForecastClick()}
            isUpdatingForecast={this.props.isUpdatingForecast}
            errorHandlingId={this.componentId}
        />
    }
    onUpdateForecastClick(){
        this.props.updateRotaForecast({
            forecastedTakeCents: utils.parseMoney(this.state.forecastedTake) * 100,
            componentId: this.componentId
        })
    }
}

function mapStateToProps(state, ownProps){
    var forecast = ownProps.forecast;
    var rota = state.rotas;
    return {
        rotaForecast: forecast,
        rota,
        isUpdatingForecast: selectUpdateRotaForecastInProgress(state, {
            serverVenueId: rota.venue.serverId,
            dateOfRota: rota.date
        })
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        updateRotaForecastWithAllDetails: function(options){
            dispatch(actionCreators.updateRotaForecast(options));
        }
    }
}

function mergeProps(stateProps, dispatchProps, ownProps){
    var extraProps = {
        updateRotaForecast: function({forecastedTakeCents, componentId}){
            dispatchProps.updateRotaForecastWithAllDetails({
                forecastedTakeCents,
                serverVenueId: stateProps.rota.venue.serverId,
                dateOfRota: stateProps.rota.date,
                errorHandlingId: componentId
            });
        }
    };
    return Object.assign({}, ownProps, stateProps, dispatchProps, extraProps);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(RotaForecast)
