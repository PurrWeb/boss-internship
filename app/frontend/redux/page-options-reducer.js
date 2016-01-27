import {actionTypes} from "./actions.js"

export default function pageOptions(state=null, action){
    switch(action.type) {
        case actionTypes.SET_PAGE_OPTIONS:
            return action.pageOptions
    }
    return state;
}