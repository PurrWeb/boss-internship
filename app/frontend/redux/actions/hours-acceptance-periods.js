import createApiRequestAction from "../create-api-request-action"
import makeApiRequestMaker, {makeApiRequestMakerIfNecessary} from "../make-api-request-maker"
import oFetch from "o-fetch"
import { apiRoutes } from "~lib/routes"
import utils from "~lib/utils"
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
            var {starts_at, ends_at, breaks, hours_acceptance_reason, reason_note} = hoursAcceptancePeriod
            var clockInDay = hoursAcceptancePeriod.clock_in_day.get(getState().clockInDays);

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
                hours_acceptance_reason_id: hoursAcceptancePeriod.hours_acceptance_reason.serverId,
                reason_note: reason_note
            }
        },
        getSuccessActionData: function(responseData, requestOptions){
            return {
                newHoursAcceptancePeriod: backendData.processHoursAcceptancePeriodObject(responseData.hours_acceptance_period),
                oldHoursAcceptancePeriod: {clientId: requestOptions.hoursAcceptancePeriod.clientId},
                newHoursAcceptanceBreaks: responseData.hours_acceptance_breaks.map(backendData.processHoursAcceptanceBreakObject)
            }
        }
    }),





            // var responseData = {
            //     hours_acceptance_period: {
            //         id: 1155,
            //         starts_at: new Date(2016, 10, 1, 9, 45).toString(),
            //         ends_at: new Date(2016, 10, 1, 20, 0).toString(),
            //         reason_note: "note returned from fake backend response",
            //         hours_acceptance_reason: {id: 912},
            //         clock_in_day: {id: 22},
            //         status: "accepted",
            //     },
            //     hours_acceptance_breaks: [{
            //         id:2233,
            //         clock_in_day: {id: 22},
            //         starts_at: new Date(2016, 10, 1, 10, 15).toString(),
            //         ends_at: new Date(2016, 10, 1, 14, 45).toString(),
            //         hours_acceptance_period: {id: 1155}
            //     }]
            // }



})

export const unacceptHoursAcceptancePeriod = createApiRequestAction({
    requestType: "UNACCEPT_HOURS_ACCEPTANCE_PERIOD",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateHoursAcceptancePeriod.method,
        path: function(requestOptions){
            return apiRoutes.updateHoursAcceptancePeriod.getPath({
                hoursAcceptancePeriodServerId: requestOptions.hoursAcceptancePeriod.serverId
            })
        },
        data: function(requestOptions){
            return {
                status: "pending"
            }
        }
    })
    //
    // function(requestOptions, success, error){
    //     setTimeout(function(){
    //         success({
    //             hoursAcceptancePeriod: {
    //                 clientId: requestOptions.hoursAcceptancePeriod.clientId,
    //                 status: "in_progress"
    //             }
    //         })
    //     }, 2000)
    // }
})
