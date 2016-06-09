import RotaDate from "~lib/rota-date"
import createApiRequestActionCreator from "../create-api-request-action-creator"
import makeApiRequestMaker from "../make-api-request-maker"
import oFetch from "o-fetch"
import getRotaFromDateAndVenue from "~lib/get-rota-from-date-and-venue"
import * as backendData from "~lib/backend-data/process-backend-objects"
import {apiRoutes} from "~lib/routes"

function confirmIfRotaIsPublished(options){
    var rota = getRotaFromDateAndVenue({
        rotas: oFetch(options, "rotasByClientId"),
        dateOfRota: oFetch(options, "dateOfRota"),
        venueId: oFetch(options, "venueClientId")
    });
    if (rota.status !== "published") {
        return true;
    }
    return confirm(options.question);
}

function getRotaDateFromShiftStartsAt(startAt){
    var rotaDate = new RotaDate({shiftStartsAt: startAt});
    return rotaDate.getDateOfRota();
}

export const addRotaShift = createApiRequestActionCreator({
    requestType: "ADD_SHIFT",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.addShift.method,
        path: function({venueServerId, starts_at}, getState) {
            var date = getRotaDateFromShiftStartsAt(starts_at);
            return apiRoutes.addShift.getPath(venueServerId, date);
        },
        data: function(options){
            var [starts_at, ends_at, staff_member_id, shift_type] = oFetch(options,
                "starts_at", "ends_at", "staffMemberServerId", "shift_type");
            return {
                starts_at,
                ends_at,
                staff_member_id,
                shift_type
            }
        },
        getSuccessActionData: function(responseData, requestOptions, getState) {
            responseData = backendData.processRotaShiftObject(responseData);

            // processRotaShiftObject will set rota.clientId based on the rota's server id
            // However, if the rota object was created on the client before it had
            // a server id, we want to use the original clientId
            var rotaDate = new RotaDate({shiftStartsAt: responseData.starts_at});
            var rota = getRotaFromDateAndVenue({
                rotas: getState().rotas,
                dateOfRota: rotaDate.getDateOfRota(),
                venueId: requestOptions.venueClientId
            });
            responseData.rota.clientId = rota.clientId;

            return {shift: responseData};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Adding a shift to a published rota will send out email notifications. Do you want to continue?"
        })
    }
});

export const updateRotaShift = createApiRequestActionCreator({
    requestType: "UPDATE_SHIFT",
    makeRequest: makeApiRequestMaker({
        path: (options) => apiRoutes.updateShift.getPath({shiftId: options.shiftServerId}),
        method: apiRoutes.updateShift.method,
        data: function(options, getState){
            var shiftType = oFetch(options, "shiftType");
            var staffMemberId = getState().rotaShifts[options.shiftClientId].staff_member.serverId;
            var shift = {
                shift_id: options.shiftServerId,
                starts_at: options.starts_at,
                ends_at: options.ends_at,
                staff_member_id: staffMemberId,
                shift_type: shiftType
            }
            return shift;
        },
        getSuccessActionData(responseData){
            var shift = backendData.processRotaShiftObject(responseData);
            return {shift};
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Updating a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});

export const deleteRotaShift = createApiRequestActionCreator({
    requestType: "DELETE_SHIFT",
    makeRequest: makeApiRequestMaker({
        method: apiRoutes.deleteShift.method,
        path: (options) => apiRoutes.deleteShift.getPath({shiftId: oFetch(options, "shift.serverId")}),
        getSuccessActionData: function(responseData, requestOptions) {
            return {shiftClientId: requestOptions.shift.clientId}
        }
    }),
    confirm: function(requestOptions, getState){
        var venueClientId = oFetch(requestOptions, "venueClientId");
        var dateOfRota = new RotaDate({shiftStartsAt: oFetch(requestOptions, "shift.starts_at")}).getDateOfRota();
        return confirmIfRotaIsPublished({
            venueClientId,
            dateOfRota,
            rotasByClientId: getState().rotas,
            question: "Deleting a shift on a published rota will send out email notifications. Do you want to continue?"
        })
    }
});
