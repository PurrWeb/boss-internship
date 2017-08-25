import _ from "underscore"
import utils from "~/lib/utils"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("rotaForecasts", {
    REPLACE_ALL_ROTA_FORECASTS: {
        action: "replaceAll"
    },
    UPDATE_ROTA_FORECAST_SUCCESS: function(state, action){
        let newForecast = action.rotaForecast;
        let rotaForecast = state;

        let datesAreEqual = utils.datesAreEqual(rotaForecast.date, newForecast.date);
        let venuesAreEqual = rotaForecast.venue.clientId === newForecast.venue.clientId;
        let existingRotaForecast = datesAreEqual && venuesAreEqual;

        var newState = Object.assign({}, state);
        if (existingRotaForecast){
            delete newState[existingRotaForecast.clientId];
        }
        newState[newForecast.clientId] = newForecast;
        return newState;
    }
})
