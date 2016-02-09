import {actionTypes} from "./actions.js"

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
    }
    return state;
}