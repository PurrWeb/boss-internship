import oFetch from "o-fetch"
import makeReducer from "./make-reducer"

export default makeReducer({
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
