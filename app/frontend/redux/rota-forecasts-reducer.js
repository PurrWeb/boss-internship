import _ from "underscore"
import utils from "~lib/utils"
import {actionTypes} from "./actions.js"

export default function rotaForecastsReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTA_FORECASTS:
            return action.rotaForecasts;
        case actionTypes.UPDATE_ROTA_FORECAST_SUCCESS:
            var newForecast = action.rotaForecast;
            var existingRotaForecast = _.find(state, function(rotaForecast){
                var datesAreEqual = utils.datesAreEqual(rotaForecast.date, newForecast.date);
                var venuesAreEqual = rotaForecast.venue.clientId === newForecast.venue.clientId;
                return datesAreEqual && venuesAreEqual;
            });

            var newState = Object.assign({}, state);
            if (existingRotaForecast){
                delete newState[existingRotaForecast.clientId];
            }
            newState[newForecast.clientId] = newForecast;
            return newState;
    }
    return state;
}