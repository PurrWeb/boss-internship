import makeDataHandler from "./make-data-handler"

export default makeDataHandler("confirmationModal", {
    SHOW_CONFIRMATION_MODAL: function(state, action){
        return action.payload;
    },
    CANCEL_CONFIRMATION_MODAL: function(state, action){
        return null
    },
    COMPLETE_CONFIRMATION_MODAL: function(state, action){
        return null;
    }
}, {
    initialState: null
})
