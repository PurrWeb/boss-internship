import {actionTypes} from "./actions.js"
import utils from "~lib/utils"
import _ from "underscore"
import oFetch from "o-fetch"

export default function rotasReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTAS:
            return action.rotas
        case actionTypes.UPDATE_ROTA_STATUS_SUCCESS:
            var [rotaClientId, status] = oFetch(action, "rotaClientId", "status");
            var newState = {...state};
            var rota = _.find(newState, {clientId: rotaClientId})
            rota.status = status;
            newState[rota.clientId] = rota;
            return newState;
        case actionTypes.PUBLISH_ROTAS_SUCCESS:
            return _(state).mapObject(function(rota){
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
            });
        case actionTypes.ADD_SHIFT_SUCCESS:
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
    return state;
}
