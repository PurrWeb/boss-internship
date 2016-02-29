import React from "react"
import _ from "underscore"
import utils from "~lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import { updateRotaForecast } from "~redux/actions"
import { selectUpdateRotaForecastInProgress, selectForecastByRotaId } from "~redux/selectors"

class RotaForecast extends React.Component {
    static propTypes = {
        rotaId: React.PropTypes.any.isRequired,
        canEditForecastedTake: React.PropTypes.bool
    }
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
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
            isUpdatingForecast={this.props.isUpdatingForecast}
            errors={this.props.componentErrors[this.componentId]} />
    }
    onUpdateForecastClick(){
        this.props.updateRotaForecast({
            forecastedTake: utils.parseMoney(this.state.forecastedTake),
            componentId: this.componentId
        })
    }
}

function mapStateToProps(state, ownProps){
    var forecast = selectForecastByRotaId(state, ownProps.rotaId);
    var rota = state.rotas[ownProps.rotaId];
    return {
        rotaForecast: forecast,
        rota,
        componentErrors: state.componentErrors,
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
        updateRotaForecast: function({forecastedTake, componentId}){
            dispatchProps.updateRotaForecastWithAllDetails({
                forecastedTake,
                venueId: stateProps.rota.venue.id,
                dateOfRota: stateProps.rota.date,
                errorHandlingComponent: componentId
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

