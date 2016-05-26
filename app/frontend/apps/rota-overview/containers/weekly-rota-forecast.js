import React from "react"
import _ from "underscore"
import utils from "~lib/utils"
import { connect } from "react-redux"
import RotaForecastUi from "../components/rota-forecast"
import actionCreators from "~redux/actions"
import { selectFetchWeeklyRotaIsInProgress } from "~redux/selectors"
import Spinner from "~components/spinner"
import ComponentErrors from "~components/component-errors"

class WeeklyRotaForecast extends React.Component {
    static propTypes = {
        startOfWeek: React.PropTypes.instanceOf(Date).isRequired
    }
    constructor(props){
        super(props);
        this.componentId = _.uniqueId();
    }
    componentWillMount(){
        this.fetchForecastIfRequired(this.props)
    }
    componentWillUpdate(props){
        this.fetchForecastIfRequired(props);
    }
    render(){
        var componentErrors = this.getComponentErrors(this.props);

        if (componentErrors !== undefined){
            return <div>
                <div style={{marginBottom: 10}}>
                    Reload the page to re-attempt loading the weekly forecast.
                </div>
                <ComponentErrors errors={componentErrors} />
            </div>
        }
        if (this.props.isFetchingWeeklyRotaForecast) {
            return <Spinner />
        }
        if (!this.props.weeklyRotaForecast.forecast) {
            return null;
        }

        return <RotaForecastUi
            rotaForecast={this.props.weeklyRotaForecast.forecast}
            forecastedTake={utils.formatMoney(this.props.weeklyRotaForecast.forecast.forecasted_take)}
            canEditForecastedTake={false} />
    }
    getComponentErrors(props){
        return props.componentErrors[this.componentId];
    }
    fetchForecastIfRequired(props){
        if (props.weeklyRotaForecast.forecast !== null && !props.weeklyRotaForecast.needsUpdate){
            return; // no need to fetch the forecast
        }
        if (props.isFetchingWeeklyRotaForecast){
            return; // already fetching the forecast
        }
        if (this.getComponentErrors(props) !== undefined){
            return; // we already tried fetching and it failed... don't try again to avoid infinite attempts
        }

        props.fetchForecast(this.componentId);
    }
}

function mapStateToProps(state, ownProps){
    return {
        weeklyRotaForecast: state.weeklyRotaForecast,
        isFetchingWeeklyRotaForecast: selectFetchWeeklyRotaIsInProgress(state),
        componentErrors: state.componentErrors
    }
}

function mapDispatchToProps(dispatch, ownProps){
    return {
        fetchForecast: function(componentId){
            dispatch(actionCreators.fetchWeeklyRotaForecast({
                serverVenueId: ownProps.serverVenueId,
                startOfWeek: ownProps.startOfWeek,
                errorHandlingComponent: componentId
            }));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WeeklyRotaForecast)
