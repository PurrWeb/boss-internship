import oFetch from "o-fetch"
import actionTypes from "./action-types"
import { registeredApiRequestActionCreators } from "~redux/create-api-request-action"

function showConfirmationModal(options){
    var [modalOptions, confirmationAction] = oFetch(options,
            "modalOptions", "confirmationAction");
    return {
        type: actionTypes.SHOW_CONFIRMATION_MODAL,
        payload: {
            modalOptions,
            confirmationAction
        }
    }
}

function cancelConfirmationModal(){
    return {
        type: actionTyes.CANCEL_CONFIRMATION_MODAL
    }
}

function completeConfirmationModal(confirmationData){
    return function(dispatch, getState){
        var completeModalAction = {
            type: actionTypes.COMPLETE_CONFIRMATION_MODAL
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
