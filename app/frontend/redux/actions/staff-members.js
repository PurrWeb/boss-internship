import makeApiRequestMaker from "../make-api-request-maker"
import createApiRequestActionCreator from "../create-api-request-action-creator"
import oFetch from "o-fetch"
import { showConfirmationModal } from "./confirmation-modal"
import {apiRoutes} from "~lib/routes"

export function updateStaffMemberPinWithEntryModal(requestOptions){
    var staffMemberObject = oFetch(requestOptions, "staffMemberObject");
    var staffMemberName = staffMemberObject.first_name + staffMemberObject.surname;
    return showConfirmationModal({
        modalOptions: {
            title: "Enter a new PIN for " + staffMemberName,
            confirmationType: "PIN"
        },
        confirmationAction: {
            apiRequestType: "UPDATE_STAFF_MEMBER_PIN",
            requestOptions: requestOptions
        }
    });
}

export const updateStaffMemberPin = createApiRequestActionCreator({
    requestType: "UPDATE_STAFF_MEMBER_PIN",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.changeStaffMemberPin.method,
        path(requestOptions) {
            var staffMemberServerId = oFetch(requestOptions, "staffMemberObject.serverId");
            return apiRoutes.changeStaffMemberPin.getPath({
                staffMemberServerId
            });
        },
        accessToken: function(requestOptions, getState){
            return getState().clockInOutAppUserMode.token
        },
        data: function(requestOptions, getState) {
            return {
                pin_code: requestOptions.confirmationData.pin
            }
        },
        getSuccessActionData(){
            return {};
        }
    })
})
