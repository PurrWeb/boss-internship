import oFetch from "o-fetch"
import { registeredApiRequestActionCreators } from "~redux/create-api-request-action"

function showConfirmationModal(options){
    var [modalOptions, confirmationAction] = oFetch(options,
            "modalOptions", "confirmationAction");
    return {
        type: showConfirmationModal.actionType,
        payload: {
            modalOptions,
            confirmationAction
        }
    }
}
showConfirmationModal.actionType = "SHOW_CONFIRMATION_MODAL"

function cancelConfirmationModal(){
    return {
        type: cancelConfirmationModal.actionType
    }
}
cancelConfirmationModal.actionType = "CANCEL_CONFIRMATION_MODAL"

function completeConfirmationModal(confirmationData){
    return function(dispatch, getState){
        var completeModalAction = {
            type: completeConfirmationModal.actionType
        }

        var confirmationActionInfo = getState().confirmationModal.confirmationAction;
        var actionCreator = registeredApiRequestActionCreators[confirmationActionInfo.apiRequestType];
        var actionCreatorOptions = {...confirmationActionInfo.options};
        actionCreatorOptions.confirmationData = confirmationData;
        var confirmedAction = actionCreator(actionCreatorOptions);

        // Don't dispatch as an array because redux batch middleware doesn't seem to be
        // able to dispatch redux thunk actions
        dispatch(confirmedAction);
        dispatch(completeModalAction);
    }
}
completeConfirmationModal.actionType = "COMPLETE_CONFIRMATION_MODAL"

export { showConfirmationModal, cancelConfirmationModal, completeConfirmationModal }