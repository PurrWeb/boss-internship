import createApiRequestAction from "../create-api-request-action"
import makeApiRequestMaker, {makeApiRequestMakerIfNecessary} from "../make-api-request-maker"
import oFetch from "o-fetch"
import * as backendData from "~lib/backend-data/process-backend-objects"
import {objectHasBeenSavedToBackend} from "~lib/backend-data/process-backend-object"

export const deleteHoursAcceptancePeriod = createApiRequestAction({
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
        makeRequest: function(requestOptions, success, error){
            setTimeout(function(){
                success({
                    hoursAcceptancePeriod: {
                        clientId: requestOptions.hoursAcceptancePeriod.clientId
                    }
                })
            }, 2000)
        }
    })
});

export const acceptHoursAcceptancePeriod = createApiRequestAction({
    requestType: "ACCEPT_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: function(requestOptions, success, error){
        setTimeout(function(){
            var hoursAcceptancePeriod = oFetch(requestOptions, "hoursAcceptancePeriod")
            var {starts_at, ends_at, breaks, reason, reason_note} = hoursAcceptancePeriod

            var requestData = {
                hours_acceptance_period_id: hoursAcceptancePeriod.serverId,
                starts_at,
                ends_at,
                hours_acceptance_breaks: breaks.map((b) => {
                    return {
                        starts_at: b.starts_at,
                        ends_at: b.ends_at
                    }
                }),
                reason_id: reason.serverId,
                reason_note: reason_note
            }

            var responseData = {
                hours_acceptance_period: {
                    id: 1155,
                    starts_at: new Date(2016, 10, 1, 9, 45).toString(),
                    ends_at: new Date(2016, 10, 1, 20, 0).toString(),
                    reason_note: "note returned from fake backend response",
                    reason: {id: 912},
                    clock_in_day: {id: 22},
                    status: "accepted",
                },
                hours_acceptance_breaks: [{
                    id:2233,
                    clock_in_day: {id: 22},
                    starts_at: new Date(2016, 10, 1, 10, 15).toString(),
                    ends_at: new Date(2016, 10, 1, 14, 45).toString(),
                    hours_acceptance_period: {id: 1155}
                }]
            }

            success({
                newHoursAcceptancePeriod: backendData.processHoursAcceptancePeriodObject(responseData.hours_acceptance_period),
                oldHoursAcceptancePeriod: {clientId: requestOptions.hoursAcceptancePeriod.clientId},
                newHoursAcceptanceBreaks: responseData.hours_acceptance_breaks.map(backendData.processHoursAcceptanceBreakObject)
            })
        }, 2000)
    }
})

export const unacceptHoursAcceptancePeriod = createApiRequestAction({
    requestType: "UNACCEPT_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: function(requestOptions, success, error){
        setTimeout(function(){
            success({
                hoursAcceptancePeriod: {
                    clientId: requestOptions.hoursAcceptancePeriod.clientId,
                    status: "in_progress"
                }
            })
        }, 2000)
    }
})
