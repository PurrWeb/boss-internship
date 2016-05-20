import createApiRequestAction from "../create-api-request-action"
import {apiRoutes} from "~lib/routes"
import makeApiRequestMaker from "../make-api-request"
import oFetch from "o-fetch"
import {selectClockInOutAppIsInManagerMode} from "../selectors"

function makeApiRequestMakerIfNecessary({tryWithoutRequest, makeRequest}){
    return function(requestOptions, success, error, getState){
        var actionData = tryWithoutRequest(requestOptions);
        if (actionData){
            success(actionData);
        } else {
            return makeRequest.apply(this, arguments);
        }
    }
}


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

export const clockInOutAppEnterUserMode = createApiRequestAction({
    requestType: "CLOCK_IN_OUT_APP_ENTER_USER_MODE",
    makeRequest: makeApiRequestMakerIfNecessary({
        tryWithoutRequest: function(requestOptions){
            if (requestOptions.userMode === "user") {
                return {
                    token: null,
                    mode: "user"
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
                return {
                    mode: requestOptions.userMode,
                    token: responseData.access_token
                }
            }
        })
    })
});


export const updateStaffStatus = createApiRequestAction({
    requestType: "UPDATE_STAFF_STATUS",
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
            return {
                staffMemberObject,
                statusValue,
                userIsManagerOrSupervisor: selectClockInOutAppIsInManagerMode(getState())
            }
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
            var statusOption = staffStatusOptionsByValue[statusValue];

            var message = `${name} has been ${statusOption.confirmationTitle}.`
            dispatch(showUserActionConfirmationMessage({
                message
            }));
        }
    }
});
