import * as ACTIONS from "./actions.js"
export default function appIsInManagerMode(state=false, action){
    switch(action.type) {
        case ACTIONS.ENTER_MANAGER_MODE:
            return true;
        case ACTIONS.LEAVE_MANAGER_MODE:
            return false;
    }
    return state;
}