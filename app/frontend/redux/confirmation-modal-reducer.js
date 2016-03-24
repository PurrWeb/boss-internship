import {actionTypes} from "./actions.js"
export default function confirmationModal(state=null, action){
    switch(action.type) {
        case actionTypes.SHOW_CONFIRMATION_MODAL:
            return action.payload;
        case actionTypes.CANCEL_CONFIRMATION_MODAL:
            return null;
        case actionTypes.COMPLETE_CONFIRMATION_MODAL:
            return null;
    }
    return state;
}