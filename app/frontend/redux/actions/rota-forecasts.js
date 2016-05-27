import createApiRequestAction from "../create-api-request-action"
import makeApiRequestMaker from "../make-api-request"
import {apiRoutes} from "~lib/routes"
import * as backendData from "~lib/backend-data/process-backend-objects"
import oFetch from "o-fetch"
import { registerActionType } from "./index"

export function replaceWeeklyRotaForecast({weeklyRotaForecast}) {
    return {
        type: "REPLACE_WEEKLY_ROTA_FORECAST",
        weeklyRotaForecast
    }
}

export const updateRotaForecast = createApiRequestAction({
    requestType: "UPDATE_ROTA_FORECAST",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateRotaForecast.method,
        path: (options) => {
            var [dateOfRota, serverVenueId] = oFetch(options, "dateOfRota", "serverVenueId");
            return apiRoutes.updateRotaForecast.getPath({dateOfRota, venueId: serverVenueId})
        },
        data: ({forecastedTake}) => {return {forecasted_take: forecastedTake} },
        getSuccessActionData: function(responseData){
            return {
                rotaForecast: backendData.processRotaForecastObject(responseData)
            }
        }
    })
});

export const fetchWeeklyRotaForecast = createApiRequestAction({
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

export const actionTypes = ["REPLACE_WEEKLY_ROTA_FORECAST"]
