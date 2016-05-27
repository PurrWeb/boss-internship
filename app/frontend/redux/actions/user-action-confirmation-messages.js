import { registerActionType } from "./index"

var actionTypes = [];

actionTypes.push("SHOW_USER_ACTION_CONFIRMATION_MESSAGE")
export function showUserActionConfirmationMessage({message}) {
    return function(dispatch) {
        dispatch({
            type: "SHOW_USER_ACTION_CONFIRMATION_MESSAGE",
            message: message
        })
        setTimeout(function(){
            dispatch(hideUserActionConfirmationMessage({message}));
        }, 2000)
    }
}

actionTypes.push("HIDE_USER_ACTION_CONFIRMATION_MESSAGE")
export function hideUserActionConfirmationMessage({message}){
    return {
        type: "HIDE_USER_ACTION_CONFIRMATION_MESSAGE",
        message
    }
}

export { actionTypes}
