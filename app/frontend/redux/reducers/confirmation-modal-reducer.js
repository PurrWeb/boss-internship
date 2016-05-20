import makeReducer from "./make-reducer"

export default makeReducer({
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
