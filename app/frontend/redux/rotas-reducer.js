import {actionTypes} from "./actions.js"
export default function rotasReducer(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_ROTAS:
            return action.rotas
    }
    return state;
}