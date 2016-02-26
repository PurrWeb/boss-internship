import React from "react"
import _ from "underscore"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"

class RotaForecast extends React.Component {
    static propTypes = {
        rotaId: React.PropTypes.any.isRequired,
        canEditForecastedTake: React.PropTypes.bool
    }
    constructor(props){
        super(props);
        this.state = {
            forecastedTake: props.rotaForecast.forecasted_take
        }
    }
    render(){
        return <RotaForecastUi
            rotaForecast={this.props.rotaForecast}
            forecastedTake={this.state.forecastedTake}
            canEditForecastedTake={this.props.canEditForecastedTake}
            onForecastedTakeChanged={(forecastedTake) => this.setState({forecastedTake})}
            onUpdateForecastClick={() => this.onUpdateForecastClick()} />
    }
    onUpdateForecastClick(){
        alert("todo")
    }
}

function mapStateToProps(state, ownProps){
    var forecast = _(state.rotaForecasts).find(function(forecast){
        return forecast.rota.id === ownProps.rotaId
    });

    return {
        rotaForecast: forecast
    }
}

export default connect(mapStateToProps)(RotaForecast)