import {actionTypes} from "./actions.js"

export default function venues(state={}, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_VENUES:
            return action.venues
    }
    return state;
}