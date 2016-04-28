import {actionTypes} from "./actions"

export default function(key=null, action){
    if (action.type === actionTypes.SET_CLOCK_IN_OUT_APP_API_KEY) {
        return action.apiKey
    }
    return key;
}
