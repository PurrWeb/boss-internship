import createApiRequestActionCreator from "../create-api-request-action-creator"
import {apiRoutes} from "~/lib/routes"
import makeApiRequestMaker, {makeApiRequestMakerIfNecessary} from "../make-api-request-maker"
import oFetch from "o-fetch"
import utils from "~/lib/utils"
import {selectClockInOutAppIsInManagerMode} from "../selectors"
import clockInStatusOptionsByValue from "~/lib/clock-in-status-options-by-value"
import {showUserActionConfirmationMessage} from "./user-action-confirmation-messages"
import {showConfirmationModal} from "./confirmation-modal"
import { selectClockInDay} from "~/redux/selectors"
import _ from "underscore"
import * as backendData from "~/lib/backend-data/process-backend-objects"
import {setApiKey} from "./api-key"
import {
    loadInitialClockInOutAppState
} from "./app-data"
import { openWarningModal } from '~/components/modals';

var actionTypes = [];

export function enterUserModeWithConfirmation(options){
    return showConfirmationModal({
        modalOptions: {
            title: "Enter manager password",
            confirmationType: "PIN"
        },
        confirmationAction: {
            apiRequestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
            requestOptions: options
        }
    })
}

export function showAddNoteWindow(firstName, surname, staffMemberObject, clockInDay){
    return showConfirmationModal({
        modalOptions: {
            firstName,
            surname,
            staffMemberObject,
            clockInDay,
            confirmationType: 'ADD_NOTE'
        },
        confirmationAction: {
            apiRequestType: "null",
            requestOptions: {}
        }
    })
}

export function showWrongPinMessage(errorMessage, type, onRetryClick){
    return showConfirmationModal({
        modalOptions: {
            title: errorMessage,
            confirmationType: type,
            onRetryClick
        },
        confirmationAction: {
            apiRequestType: "null",
            requestOptions: {}
        }
    })
}

actionTypes.push("CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE")
export function clockInOutAppSelectStaffType({selectedStaffTypeClientId}){
    return {
        type: "CLOCK_IN_OUT_APP_SELECT_STAFF_TYPE",
        selectedStaffTypeClientId
    }
}


export const clockInOutAppEnterUserMode = createApiRequestActionCreator({
    requestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
    makeRequest: makeApiRequestMakerIfNecessary({
        tryWithoutRequest: function(requestOptions){
            if (requestOptions.userMode === "User") {
                return {
                    token: null,
                    mode: "User"
                }
            }
        },
        makeRequest: makeApiRequestMaker({
            doesntNeedAccessToken: true,
            method: apiRoutes.getSessionToken.method,
            path: apiRoutes.getSessionToken.getPath(),
            needsApiKey: true,
            data: function(requestOptions){
                var staff_member_id = oFetch(requestOptions, "staffMemberObject.serverId");
                var staff_member_pin = oFetch(requestOptions, "confirmationData.pin");
                return {
                    staff_member_id,
                    staff_member_pin
                }
            },
            getSuccessActionData(responseData, requestOptions){
                let rollbarData = oFetch(window, 'boss.rollbarData');
                rollbarData.currentStaffMember = responseData.staff_member;

                return {
                    mode: requestOptions.userMode,
                    token: responseData.access_token
                }
            }
        })
    })
});

function getNewClockInDayFromUpdateStatusResponse(responseData, requestOptions, getState){
    var {staffMemberObject, statusValue} = requestOptions;
    var existingClockInDay = selectClockInDay(getState(), {
        staffMemberClientId: staffMemberObject.clientId,
        date: getState().pageOptions.dateOfRota
    })
    var newClockInDay = backendData.processClockInDayObject(responseData.clock_in_day)
    newClockInDay.clientId = existingClockInDay.clientId;
    return newClockInDay
}

export const updateClockInStatus = createApiRequestActionCreator({
    requestType: "UPDATE_CLOCK_IN_STATUS",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.updateStaffClockingStatus.method,
        accessToken(requestOptions) {
            return {
                pin: requestOptions.confirmationData.pin,
                staffMemberServerId: requestOptions.staffMemberObject.serverId
            }
        },
        path: (requestOptions) => {
            var [staffMemberObject, statusValue, venueServerId, currentStatus] =
                oFetch(requestOptions, "staffMemberObject", "statusValue", "venueServerId", "currentStatus");
            return apiRoutes.updateStaffClockingStatus.getPath({
                currentStatus,
                newStatus: statusValue
            });
        },
        data: (requestOptions, getState) => {
            var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
            var statusValue = oFetch(requestOptions, "statusValue");
            var venueServerId = oFetch(requestOptions, "venueServerId");
            var date = oFetch(requestOptions, "date");
            var at = oFetch(requestOptions, "at");

            var accessToken = requestOptions.accessToken;

            return {
                staff_member_id: staffMemberObject.serverId,
                venue_id: venueServerId,
                date,
                at,
                accessToken
            }
        },
        getSuccessActionData(responseData, requestOptions, getState){
            var {staffMemberObject, statusValue} = requestOptions;
            var newClockInDay = getNewClockInDayFromUpdateStatusResponse(responseData, requestOptions, getState)
            return {
                clockInDay: newClockInDay,
                statusValue,
                staffMemberObject,
                userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(getState())
            }
        },
        getFailureActionData(responseData, requestOptions, getState){
            const { requestStatus } = responseData;
            if (requestStatus === 403) {
                return openWarningModal({
                    submit: (handleClose) => handleClose(),
                    config: {
                      title: 'WARNING !!!',
                      text: 'You need to ask manager to retake picture.',
                      buttonText: 'Submit',
                    },
                  });
            }
            return {
                clockInDay: getNewClockInDayFromUpdateStatusResponse(responseData, requestOptions, getState)
            };
        }
    }),
    additionalSuccessActionCreator: function(successActionData, requestOptions){
        return function(dispatch, getState){
            var userIsManagerOrSupervisor = selectClockInOutAppIsInManagerMode(getState());
            if (userIsManagerOrSupervisor) {
                // They aren't sent back to the staff type selector, so
                // they can see the change in the normal UI
                return;
            }

            var {first_name, surname} = successActionData.staffMemberObject;
            var name = first_name + " " + surname;
            var {statusValue} = successActionData;
            var statusOption = clockInStatusOptionsByValue[statusValue];

            var message = `${name} has been ${statusOption.confirmationTitle}.`
            dispatch(showUserActionConfirmationMessage({
                message
            }));
        }
    }
});


export function updateClockInStatusWithConfirmation(requestOptions){
    return function(dispatch, getState){``
        var state = getState();
        if (selectClockInOutAppIsInManagerMode(state)) {
            requestOptions = {
                ...requestOptions,
                accessToken: state.clockInOutAppUserMode.token
            }
            dispatch(updateClockInStatus(requestOptions))
        } else {
            var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
            var {first_name, surname} = staffMemberObject;
            dispatch(showConfirmationModal({
                modalOptions: {
                    title: `Enter PIN for ${first_name} ${surname}`,
                    confirmationType: "PIN"
                },
                confirmationAction: {
                    apiRequestType: "UPDATE_CLOCK_IN_STATUS",
                    requestOptions
                }
            }));
        }
    }
}


export const clockInOutAppFetchAppData = createApiRequestActionCreator({
    requestType: "CLOCK_IN_OUT_APP_FETCH_DATA",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.getClockInOutAppData.method,
        path: apiRoutes.getClockInOutAppData.getPath(),
        doesntNeedAccessToken: true,
        data: function(requestOptions, getState){
            return {
                api_key: getState().apiKey
            }
        },
        getSuccessActionData(responseData){
            let rollbarData = oFetch(window, "boss.rollbarData");
            rollbarData.currentVenue = {
                id: responseData.venues[0].id,
                name: responseData.venues[0].name,
                rollbar_guid: responseData.venues[0].rollbar_guid,
            }
            return responseData
        },
    }),
    getSuccessActionData(){
        return {};
    },
    additionalSuccessActionCreator: function(responseData){
        return loadInitialClockInOutAppState(responseData);
    }
})

actionTypes.push('REMOVE_CLOCK_IN_DAY');

export const removeClockInDay = function(clockInDay) {
  return  {
    type: 'REMOVE_CLOCK_IN_DAY',
    clockInDay
  }
}

export const forceStaffMemberClockOut = createApiRequestActionCreator({
    requestType: "FORCE_STAFF_MEMBER_CLOCK_OUT",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.forceClockOut.method,
        path: apiRoutes.forceClockOut.getPath(),
        data: function(requestOptions){
            return {
                staff_member_id: oFetch(requestOptions, "staffMember.serverId"),
                venue_id: oFetch(requestOptions, "clockInDay.venue.serverId"),
                date: utils.formatDateForApi(oFetch(requestOptions, "clockInDay.date"))
            }
        },
        getSuccessActionData: function(responseData, requestOptions){
            var hoursAcceptancePeriod = responseData.hours_acceptance_period;
            if (hoursAcceptancePeriod !== null) {
                hoursAcceptancePeriod = backendData.processHoursAcceptancePeriodObject(hoursAcceptancePeriod);
            }

            var successData = {
                clockInDay: {
                    clientId: requestOptions.clockInDay.clientId,
                    status: responseData.status
                },
                staffMember: requestOptions.staffMember,
                clockInPeriod: backendData.processClockInPeriodObject(responseData.clock_in_period),
                clockInBreaks: responseData.clock_in_breaks.map(backendData.processClockInBreakObject),
                hoursAcceptancePeriod,
                hoursAcceptanceBreaks: responseData.hours_acceptance_breaks.map(backendData.processHoursAcceptanceBreakObject),
                clockInEvents: [] //responseData.clock_in_events.map(backendData.processClockInEventObject)
            };

            return successData;
        }
    })
})

export function setApiKeyAndFetchClockInOutAppData(apiKey){
    return function(dispatch){
        dispatch(setApiKey({apiKey}));
        dispatch(clockInOutAppFetchAppData())
    }
}

export {actionTypes}
