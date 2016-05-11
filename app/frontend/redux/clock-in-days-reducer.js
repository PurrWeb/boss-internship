import {actionTypes} from "./actions.js"

export default function clockInDays(state=null, action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_CLOCK_IN_DAYS:
            return action.clockInDays
    }
    return state;
}
