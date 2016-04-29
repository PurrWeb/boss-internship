import {actionTypes} from "./actions"

export default function(key=null, action){
    if (action.type === actionTypes.SET_API_KEY) {
        return action.apiKey
    }
    return key;
}
