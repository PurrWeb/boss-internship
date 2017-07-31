import _ from "underscore"
import utils from "~/lib/utils"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("rotaForecasts", {
    REPLACE_ALL_ROTA_FORECASTS: {
        action: "replaceAll"
    },
    UPDATE_ROTA_FORECAST_SUCCESS: function(state, action){
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
})
