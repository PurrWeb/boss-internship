import oFetch from "o-fetch"
import makeReducer from "./make-reducer"

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

var forecast =  makeReducer({
    REPLACE_WEEKLY_ROTA_FORECAST: function(state, action){
        return oFetch(action, "weeklyRotaForecast");
    },
    FETCH_WEEKLY_ROTA_FORECAST_SUCCESS: function(state, action){
        return oFetch(action, "weeklyRotaForecast");
    },
    UPDATE_ROTA_FORECAST_SUCCESS: function(state, action){
        return null;
    }
})

var needsUpdate = makeReducer({
    REPLACE_WEEKLY_ROTA_FORECAST: function(){
        return false;
    },
    FETCH_WEEKLY_ROTA_FORECAST_REQUEST_START: function(){
        return false;
    },
    UPDATE_ROTA_FORECAST_SUCCESS: function(){
        return true;
    }
});
