import createApiRequestActionCreator from "../create-api-request-action-creator"
import makeApiRequestMaker from "../make-api-request-maker"
import {apiRoutes} from "~/lib/routes"
import * as backendData from "~/lib/backend-data/process-backend-objects"
import oFetch from "o-fetch"
import { registerActionType } from "./index"

export function replaceWeeklyRotaForecast({weeklyRotaForecast}) {
    return {
        type: "REPLACE_WEEKLY_ROTA_FORECAST",
        weeklyRotaForecast
    }
}

export const updateRotaForecast = createApiRequestActionCreator({
    requestType: "UPDATE_ROTA_FORECAST",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateRotaForecast.method,
        path: (options) => {
            var [dateOfRota, serverVenueId] = oFetch(options, "dateOfRota", "serverVenueId");
            return apiRoutes.updateRotaForecast.getPath({dateOfRota, venueId: serverVenueId})
        },
        data: ({forecastedTakeCents}) => {return {forecasted_take_cents: forecastedTakeCents} },
        getSuccessActionData: function(responseData){
            return {
                rotaForecast: backendData.processRotaForecastObject(responseData)
            }
        }
    })
});

export const fetchWeeklyRotaForecast = createApiRequestActionCreator({
    requestType: "FETCH_WEEKLY_ROTA_FORECAST",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.weeklyRotaForecast.method,
        path: (options) => {
            var [serverVenueId, startOfWeek] = oFetch(options, "serverVenueId", "startOfWeek")
            return apiRoutes.weeklyRotaForecast.getPath({venueId: serverVenueId, startOfWeek})
        },
        getSuccessActionData: function(responseData){
            return {
              weeklyRotaForecast: responseData
            };
        }
    })
});

export const getRotaWeeklyDay = createApiRequestActionCreator({
  requestType: 'GET_ROTA_WEEKLY_DAY',
  makeRequest: makeApiRequestMaker({
    method: apiRoutes.getRotaWeeklyDay.method,
    path: (options) => {
      var [serverVenueId, date] = oFetch(options, "serverVenueId", "date")
      return apiRoutes.getRotaWeeklyDay.getPath({serverVenueId: serverVenueId, date, date})
    },
    getSuccessActionData: function(responseData, requestOptions, getState){
      var state = getState();
      debugger;
      return {
        rotaWeeklyDay: responseData.rota_weekly_day
      };
    }
  })
})

export const actionTypes = ["REPLACE_WEEKLY_ROTA_FORECAST"]
