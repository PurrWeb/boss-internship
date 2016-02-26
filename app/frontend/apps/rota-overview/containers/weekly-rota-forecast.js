import React from "react"
import _ from "underscore"
import utils from "~lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import { fetchWeeklyRotaForecast } from "~redux/actions"
import { selectFetchWeeklyRotaIsInProgress } from "~redux/selectors"
import Spinner from "~components/spinner"

class WeeklyRotaForecast extends React.Component {
    static propTypes = {
        startOfWeek: React.PropTypes.instanceOf(Date).isRequired
    }
    componentWillMount(){
        this.fetchForecastIfRequired(this.props)
    }
    componentWillUpdate(props){
        this.fetchForecastIfRequired(props);
    }
    render(){
        if (this.props.isFetchingWeeklyRotaForecast) {
            return <Spinner />
        }
        if (!this.props.weeklyRotaForecast) {
            return null;
        }
        return <RotaForecastUi
            rotaForecast={this.props.weeklyRotaForecast}
            forecastedTake={utils.formatMoney(this.props.weeklyRotaForecast.forecasted_take)}
            canEditForecastedTake={false} />
    }
    fetchForecastIfRequired(props){
        if (props.weeklyRotaForecast !== null){
            return; // no need to fetch the forecast
        }
        if (props.isFetchingWeeklyRotaForecast){
            return; // already fetching the forecast
        }
        if (!props.weeklyRotaForecast && !props.isFetchingWeeklyRotaForecast) {
            props.fetchForecast();
        }
    }
}

function mapStateToProps(state, ownProps){
    return {
        weeklyRotaForecast: state.weeklyRotaForecast,
        isFetchingWeeklyRotaForecast: selectFetchWeeklyRotaIsInProgress(state)
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        fetchForecast: function(){
            dispatch(fetchWeeklyRotaForecast({
                startOfWeek: ownProps.startOfWeek
            }));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WeeklyRotaForecast)

