import {actionTypes} from "./actions.js"
import utils from "~lib/utils"
import _ from "underscore"

export default function rotasReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTAS:
            return action.rotas
        case actionTypes.UPDATE_ROTA_STATUS_SUCCESS:
            var {rotaId, status} = action;
            var newState = {...state};
            var rota = {...newState[rotaId]};
            rota.status = status;
            newState[rotaId] = rota;
            return newState;
        case actionTypes.PUBLISH_ROTAS_SUCCESS:
            return _(state).mapObject(function(rota){
                if (rota.venue.id !== action.venueId) {
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
            var rotaServerId = action.shift.rota.id;
            return _(state).mapObject(function(rota){
                if (rota.clientId !== rotaClientId){
                    return rota;
                }
                return Object.assign({}, rota, {id: rotaServerId});
            });
    }
    return state;
}