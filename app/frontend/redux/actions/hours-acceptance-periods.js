import createApiRequestAction from "../create-api-request-action"
import makeApiRequestMaker, {makeApiRequestMakerIfNecessary} from "../make-api-request"
import oFetch from "o-fetch"
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
            success({
                hoursAcceptancePeriod: {
                    clientId: requestOptions.hoursAcceptancePeriod.clientId,
                    status: "accepted"
                }
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
