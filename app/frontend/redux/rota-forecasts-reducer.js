import _ from "underscore"
import {actionTypes} from "./actions.js"

export default function rotaForecastsReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTA_FORECASTS:
            return action.rotaForecasts;
        case actionTypes.UPDATE_ROTA_FORECAST_SUCCESS:
            var newForecast = action.rotaForecast;
            var existingRotaForecast = _.find(state, function(rotaForecast){
                return rotaForecast.rota.id === newForecast.rota.id
            });

            var newState = Object.assign({}, state, {[newForecast.id]: newForecast});
            if (existingRotaForecast){
                delete newState[existingRotaForecast.id];
            }
            return newState;
    }
    return state;
}