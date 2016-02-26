import React from "react"
import _ from "underscore"
import utils from "~lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import { updateRotaForecast } from "~redux/actions"
import { selectUpdateRotaForecastInProgress } from "~redux/selectors"

class RotaForecast extends React.Component {
    static propTypes = {
        rotaId: React.PropTypes.any.isRequired,
        canEditForecastedTake: React.PropTypes.bool
    }
    constructor(props){
        super(props);
        this.state = {
            forecastedTake: utils.formatMoney(props.rotaForecast.forecasted_take)
        }
    }
    render(){
        return <RotaForecastUi
            rotaForecast={this.props.rotaForecast}
            forecastedTake={this.state.forecastedTake}
            canEditForecastedTake={this.props.canEditForecastedTake}
            onForecastedTakeChanged={(forecastedTake) => this.setState({forecastedTake})}
            onUpdateForecastClick={() => this.onUpdateForecastClick()}
            isUpdatingForecast={this.props.isUpdatingForecast} />
    }
    onUpdateForecastClick(){
        this.props.updateRotaForecast({
            forecastedTake: utils.parseMoney(this.state.forecastedTake)
        })
    }
}

function mapStateToProps(state, ownProps){
    var forecast = _(state.rotaForecasts).find(function(forecast){
        return forecast.rota.id === ownProps.rotaId
    });
    var rota = state.rotas[ownProps.rotaId];
    return {
        rotaForecast: forecast,
        rota,
        isUpdatingForecast: selectUpdateRotaForecastInProgress(state, {
            venueId: rota.venue.id,
            dateOfRota: rota.date
        })
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        updateRotaForecastWithAllDetails: function(options){
            dispatch(updateRotaForecast(options));
        }
    }
}

function mergeProps(stateProps, dispatchProps, ownProps){
    var extraProps = {
        updateRotaForecast: function({forecastedTake}){
            dispatchProps.updateRotaForecastWithAllDetails({
                forecastedTake,
                venueId: stateProps.rota.venue.id,
                dateOfRota: stateProps.rota.date,
                rotaIdJustForTestingRemoveLater: stateProps.rota.id
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

