import { registerActionType } from "./index"

registerActionType("SHOW_USER_ACTION_CONFIRMATION_MESSAGE")
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

registerActionType("HIDE_USER_ACTION_CONFIRMATION_MESSAGE")
export function hideUserActionConfirmationMessage({message}){
    return {
        type: "HIDE_USER_ACTION_CONFIRMATION_MESSAGE",
        message
    }
}
