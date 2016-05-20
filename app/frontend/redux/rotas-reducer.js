import {actionTypes} from "./actions.js"
import utils from "~lib/utils"
import _ from "underscore"
import oFetch from "o-fetch"
import makeReducer, {makeHandlerForGenericReplaceAction} from "./make-reducer"

export default makeReducer({
    GENERIC_REPLACE_ALL_ITEMS: makeHandlerForGenericReplaceAction("rotas"),
    UPDATE_ROTA_STATUS_SUCCESS: function(state, action) {
        var [rotaClientId, status] = oFetch(action, "rotaClientId", "status");
        var newState = {...state};
        var rota = _.find(newState, {clientId: rotaClientId})
        rota.status = status;
        newState[rota.clientId] = rota;
        return newState;
    },
    PUBLISH_ROTAS_SUCCESS: function(state, action){
        if (rota.venue.serverId !== action.venueServerId) {
            return rota;
        }
        var weekStartDate = utils.getWeekStartDate(action.date);
        var weekEndDate = utils.getWeekEndDate(action.date);
        var isWithinUpdatedDateRange = rota.date >= weekStartDate &&
            rota.date <= weekEndDate;
        if (!isWithinUpdatedDateRange) {
            return rota;
        }
        return Object.assign({}, rota, {status: "published"});
    },
    ADD_SHIFT_SUCCESS: function(state, action){
        // may now have the correct backend rota ID
        var rotaClientId = action.shift.rota.clientId;
        var rotaServerId = action.shift.rota.serverId;
        return _(state).mapObject(function(rota){
            if (rota.clientId !== rotaClientId){
                return rota;
            }
            return Object.assign({}, rota, {serverId: rotaServerId});
        });
    }
})
