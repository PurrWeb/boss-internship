import React from "react"
import _ from "underscore"
import utils from "~lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"

class WeeklyRotaForecast extends React.Component {
    static propTypes = {
        weeklyRotaForecast: React.PropTypes.object.isRequired
    }
    render(){
        return <RotaForecastUi
            rotaForecast={this.props.weeklyRotaForecast}
            forecastedTake={utils.formatMoney(this.props.weeklyRotaForecast.forecasted_take)}
            canEditForecastedTake={false} />
    }
}

function mapStateToProps(state, ownProps){
    return {
        weeklyRotaForecast: state.weeklyRotaForecast
    }
}



export default connect(
    mapStateToProps
)(WeeklyRotaForecast)

