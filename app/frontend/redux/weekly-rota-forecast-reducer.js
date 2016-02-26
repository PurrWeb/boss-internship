import {actionTypes} from "./actions.js"
import oFetch from "o-fetch"

export default function rotaForecastsReducer(state=null, action){
    switch(action.type) {
        case actionTypes.REPLACE_WEEKLY_ROTA_FORECAST:
            return oFetch(action, "weeklyRotaForecast");
        case actionTypes.UPDATE_ROTA_FORECAST_SUCCESS:
            alert("handle this")
    }
    return state;
}