import oFetch from "o-fetch"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("userActionConfirmationMessages", {
    SHOW_USER_ACTION_CONFIRMATION_MESSAGE: function(messages, action){
        return [...messages, oFetch(action, "message")];
    },
    HIDE_USER_ACTION_CONFIRMATION_MESSAGE: function(messages, action){
        return messages.filter(function(message){
            return message !== oFetch(action, "message");
        })
    }
}, {
    initialState: []
})
