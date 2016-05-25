import oFetch from "o-fetch"
import { registeredApiRequestActionCreators } from "~redux/create-api-request-action"
import { registerActionType } from "./index"

registerActionType("SHOW_CONFIRMATION_MODAL")
function showConfirmationModal(options){
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

registerActionType("CANCEL_CONFIRMATION_MODAL")
function cancelConfirmationModal(){
    return {
        type: "CANCEL_CONFIRMATION_MODAL"
    }
}

registerActionType("COMPLETE_CONFIRMATION_MODAL")
function completeConfirmationModal(confirmationData){
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

export { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal }
