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

export function hideUserActionConfirmationMessage({message}){
    return {
        type: "HIDE_USER_ACTION_CONFIRMATION_MESSAGE",
        message
    }
}
