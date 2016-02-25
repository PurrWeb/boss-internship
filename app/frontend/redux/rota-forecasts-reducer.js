import {actionTypes} from "./actions.js"

export default function rotaForecastsReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTA_FORECASTS:
            return action.rotaForecasts;
    }
    return state;
}