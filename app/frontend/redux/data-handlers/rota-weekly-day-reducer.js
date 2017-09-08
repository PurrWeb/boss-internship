import utils from "~/lib/utils"
import _ from "underscore"
import oFetch from "o-fetch"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("rotaWeeklyDay", {
    UPDATE_ROTA_WEEKLY_DAY: (state, action) => {
      return action.payload.rotaWeeklyDay;
    },
    REPLACE_ROTA_WEEKLY_DAY: {
      action: "replaceAll"
    },
    PUBLISH_ROTAS_SUCCESS: function(state, action){
      const rota = state.rota;

      if (rota.venue.serverId !== action.venueServerId) {
          return state;
      }
      var weekStartDate = utils.getWeekStartDate(action.date);
      var weekEndDate = utils.getWeekEndDate(action.date);
      var isWithinUpdatedDateRange = rota.date >= weekStartDate &&
          rota.date <= weekEndDate;
      if (!isWithinUpdatedDateRange) {
          return state;
      }

      return {...state, rota: {...state.rota, status: "published"}};
    },
    UPDATE_ROTA_FORECAST_SUCCESS: function(state, action) {
      let newForecast = action.rotaForecast;
      let rotaWeeklyDay = state;
      let rotaForecast = state.rota_forecast;

      let datesAreEqual = utils.datesAreEqual(rotaForecast.date, newForecast.date);
      let venuesAreEqual = rotaForecast.venue.clientId === newForecast.venue.clientId;
      let existingRotaForecast = datesAreEqual && venuesAreEqual;

      var newState = Object.assign({}, state);
      if (existingRotaForecast){
          delete newState['rota_forecast'][existingRotaForecast.clientId];
      }
      newState['rota_forecast'] = newForecast;
      return newState;
    }
})
