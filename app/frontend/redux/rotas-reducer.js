import {actionTypes} from "./actions.js"
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
                var isWithinUpdatedDateRange = rota.date >= action.startDate &&
                    rota.date <= action.endDate;
                if (!isWithinUpdatedDateRange) {
                    return rota;
                }
                return Object.assign({}, rota, {status: "published"});
            });
    }
    return state;
}