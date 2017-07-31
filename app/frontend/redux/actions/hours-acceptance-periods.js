import createApiRequestActionCreator from "../create-api-request-action-creator"
import makeApiRequestMaker, {makeApiRequestMakerIfNecessary} from "../make-api-request-maker"
import oFetch from "o-fetch"
import { apiRoutes } from "~/lib/routes"
import utils from "~/lib/utils"
import * as backendData from "~/lib/backend-data/process-backend-objects"
import {objectHasBeenSavedToBackend} from "~/lib/backend-data/process-backend-object"

export const deleteHoursAcceptancePeriod = createApiRequestActionCreator({
    requestType: "DELETE_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: makeApiRequestMakerIfNecessary({
        tryWithoutRequest: function(requestOptions){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            if (!objectHasBeenSavedToBackend(hoursAcceptancePeriod)){
                return {
                    hoursAcceptancePeriod: {
                        clientId: hoursAcceptancePeriod.clientId
                    }
                }
            }
        },
        makeRequest: makeApiRequestMaker({
            method: apiRoutes.deleteHoursAcceptancePeriod.method,
            path: function(requestOptions){
                return apiRoutes.deleteHoursAcceptancePeriod.getPath({
                    hoursAcceptancePeriodServerId: requestOptions.hoursAcceptancePeriod.serverId
                })
            },
            data: function(){
                return {}
            },
            getSuccessActionData: function(responseData, requestOptions){
                return {
                    hoursAcceptancePeriod: {
                        clientId: requestOptions.hoursAcceptancePeriod.clientId
                    }
                }
            }
        })
    })
});


export const acceptHoursAcceptancePeriod = createApiRequestActionCreator({
    requestType: "ACCEPT_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: makeApiRequestMaker({
        method: function(requestOptions){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            if (objectHasBeenSavedToBackend(hoursAcceptancePeriod)){
                return apiRoutes.updateHoursAcceptancePeriod.method
            } else {
                return apiRoutes.createHoursAccceptancePeriod.method
            }
        },
        path: function(requestOptions){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            if (objectHasBeenSavedToBackend(hoursAcceptancePeriod)){
                return apiRoutes.updateHoursAcceptancePeriod.getPath({
                    hoursAcceptancePeriodServerId: hoursAcceptancePeriod.serverId
                })
            } else {
                return apiRoutes.createHoursAccceptancePeriod.getPath()
            }
        },
        data: function(requestOptions, getState){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            var clockInDay = hoursAcceptancePeriod.clock_in_day.get(getState().clockInDays);

            var apiData = getHoursAcceptancePeriodAPIData(hoursAcceptancePeriod, clockInDay);
            apiData.status = "accepted"
            return apiData
        },
        getSuccessActionData: function(responseData, requestOptions){
            return getHoursAcceptancePeriodUpdateSuccessActionData(responseData, requestOptions)
        }
    })
})

export const unacceptHoursAcceptancePeriod = createApiRequestActionCreator({
    requestType: "UNACCEPT_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateHoursAcceptancePeriod.method,
        path: function(requestOptions){
            return apiRoutes.updateHoursAcceptancePeriod.getPath({
                hoursAcceptancePeriodServerId: requestOptions.hoursAcceptancePeriod.serverId
            })
        },
        data: function(requestOptions, getState){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            var clockInDay = hoursAcceptancePeriod.clock_in_day.get(getState().clockInDays);
            var apiData = getHoursAcceptancePeriodAPIData(hoursAcceptancePeriod, clockInDay)
            apiData.status = "pending";
            return apiData;
        },
        getSuccessActionData: function(responseData, requestOptions){
            return getHoursAcceptancePeriodUpdateSuccessActionData(responseData, requestOptions)
        }
    })
})

function getHoursAcceptancePeriodAPIData(hoursAcceptancePeriod, clockInDay){
    var {starts_at, ends_at, breaks, reason_note} = hoursAcceptancePeriod

    var periodIdentificationData;
    if (objectHasBeenSavedToBackend(hoursAcceptancePeriod)) {
        periodIdentificationData = {
            hours_acceptance_period_id: hoursAcceptancePeriod.serverId
        }
    } else {
        periodIdentificationData = {
            venue_id: clockInDay.venue.serverId,
            date: utils.formatDateForApi(clockInDay.date),
            staff_member_id: clockInDay.staff_member.serverId
        }
    }

    return {
        status: "accepted",
        ...periodIdentificationData,
        starts_at,
        ends_at,
        hours_acceptance_breaks: breaks.map((b) => {
            return {
                starts_at: b.starts_at,
                ends_at: b.ends_at
            }
        }),
        reason_note: reason_note
    }
}

function getHoursAcceptancePeriodUpdateSuccessActionData(responseData, requestOptions){
    return {
        newHoursAcceptancePeriod: backendData.processHoursAcceptancePeriodObject(responseData.hours_acceptance_period),
        oldHoursAcceptancePeriod: {clientId: requestOptions.hoursAcceptancePeriod.clientId},
        newHoursAcceptanceBreaks: responseData.hours_acceptance_breaks.map(backendData.processHoursAcceptanceBreakObject)
    }
}
