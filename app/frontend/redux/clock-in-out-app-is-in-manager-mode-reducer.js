import { actionTypes } from "./actions.js"
export default function clockInOutAppIsInManagerMode(state=false, action){
    switch(action.type) {
        case actionTypes.ENTER_MANAGER_MODE:
            return true;
        case actionTypes.LEAVE_MANAGER_MODE:
            return false;
    }
    return state;
}