import PropTypes from 'prop-types';
import React from "react"
import _ from "underscore"
import utils from "~/lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import actionCreators from "~/redux/actions"
import { selectUpdateRotaForecastInProgress, selectForecastByRotaId } from "~/redux/selectors"

class RotaForecast extends React.Component {
    static propTypes = {
        rotaClientId: PropTypes.any.isRequired,
        canEditForecastedTake: PropTypes.bool
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
            isLoading={this.props.requestsInProgress}
            rotaForecast={this.props.rotaForecast}
            forecastedTake={this.state.forecastedTake}
            canEditForecastedTake={this.props.canEditForecastedTake}
            onForecastedTakeChanged={(forecastedTake) => this.setState({forecastedTake})}
            onUpdateForecastClick={(forecastedTake) => this.onUpdateForecastClick(forecastedTake)}
            isUpdatingForecast={this.props.isUpdatingForecast}
            errorHandlingId={this.componentId}
        />
    }
    onUpdateForecastClick(forecastedTake){
        this.props.updateRotaForecast({
            forecastedTakeCents: utils.parseMoney(forecastedTake) * 100,
            componentId: this.componentId
        })
    }
}

function mapStateToProps(state, ownProps){
    var forecast = ownProps.forecast;
    var rota = state.rotaWeeklyDay.rota;
    return {
        requestsInProgress: _.some(state.apiRequestsInProgress),
        rotaForecast: state.rotaWeeklyDay.rota_forecast,
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
            dispatch(actionCreators().updateRotaForecast(options));
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
