import createApiRequestActionCreator from "../create-api-request-action-creator"
import makeApiRequestMaker from "../make-api-request-maker"
import {apiRoutes} from "~/lib/routes"
import * as backendData from "~/lib/backend-data/process-backend-objects"
import utils from "~/lib/utils"
import oFetch from "o-fetch"

export const addClockInNote = createApiRequestActionCreator({
    requestType: "ADD_CLOCK_IN_NOTE",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.addClockInNote.method,
        path: apiRoutes.addClockInNote.getPath(),
        accessToken: function(requestOptions, getState){
            return getState().clockInOutAppUserMode.token
        },
        data: function(requestOptions, getState) {
            var date = getState().pageOptions.dateOfRota;
            return {
                staff_member_id: oFetch(requestOptions, "staffMemberObject.serverId"),
                date: utils.formatDateForApi(date),
                note: oFetch(requestOptions, "text")
            }
        },
        getSuccessActionData(responseData, requestOptions){
            return {
                clockInNote: backendData.processClockInNoteObject(responseData)
            }
        }
    })
})
