import oFetch from "o-fetch"
import { registeredApiRequestActionCreators } from "~redux/create-api-request-action-creator"
import { registerActionType } from "./index"

var actionTypes = []
actionTypes.push("SHOW_CONFIRMATION_MODAL")
export function showConfirmationModal(options){
    var [modalOptions, confirmationAction] = oFetch(options,
            "modalOptions", "confirmationAction");
    return {
        type: "SHOW_CONFIRMATION_MODAL",
        payload: {
            modalOptions,
            confirmationAction
        }
    }
}

actionTypes.push("CANCEL_CONFIRMATION_MODAL")
export function cancelConfirmationModal(){
    return {
        type: "CANCEL_CONFIRMATION_MODAL"
    }
}

actionTypes.push("COMPLETE_CONFIRMATION_MODAL")
export function completeConfirmationModal(confirmationData){
    return function(dispatch, getState){
        var completeModalAction = {
            type: "COMPLETE_CONFIRMATION_MODAL"
        }

        var confirmationActionInfo = getState().confirmationModal.confirmationAction;
        var actionCreator = registeredApiRequestActionCreators[confirmationActionInfo.apiRequestType];
        var actionCreatorRequestOptions = {...confirmationActionInfo.requestOptions};
        actionCreatorRequestOptions.confirmationData = confirmationData;
        var confirmedAction = actionCreator(actionCreatorRequestOptions);

        // Don't dispatch as an array because redux batch middleware doesn't seem to be
        // able to dispatch redux thunk actions
        dispatch(confirmedAction);
        dispatch(completeModalAction);
    }
}

export { actionTypes }
