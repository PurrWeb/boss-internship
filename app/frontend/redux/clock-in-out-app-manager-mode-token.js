import { actionTypes } from "./actions.js"
export default function clockInOutAppManagerModeToken(state=null, action){
    switch(action.type) {
        case actionTypes.ENTER_MANAGER_MODE:
            return action.token;
        case actionTypes.LEAVE_MANAGER_MODE:
            return null;
    }
    return state;
}