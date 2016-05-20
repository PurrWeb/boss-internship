import oFetch from "o-fetch"

var initialState = {
    needsUpdate: false,
    forecast: null
}

export default function weeklyRotaForecastReducer(state=initialState, action){
    return {
        needsUpdate: needsUpdate(state.needsUpdate, action),
        forecast: forecast(state.forecast, action)
    }
}

function forecast(state, action){
    switch(action.type) {
        case "REPLACE_WEEKLY_ROTA_FORECAST":
            return oFetch(action, "weeklyRotaForecast");
        case "FETCH_WEEKLY_ROTA_FORECAST_SUCCESS":
            return oFetch(action, "weeklyRotaForecast");
        case "UPDATE_ROTA_FORECAST_SUCCESS":
            return null;
    }
    return state;
}

function needsUpdate(state, action){
    switch(action.type) {
        case "REPLACE_WEEKLY_ROTA_FORECAST":
            return false;
        case "FETCH_WEEKLY_ROTA_FORECAST_REQUEST_START":
            return false;
        case "UPDATE_ROTA_FORECAST_SUCCESS":
            return true;
    }
    return state;
}
