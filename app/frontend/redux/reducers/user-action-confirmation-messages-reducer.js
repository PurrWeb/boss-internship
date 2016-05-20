import oFetch from "o-fetch"

export default function userActionConfirmationMessages(messages=[], action){
    switch(action.type){
        case "SHOW_USER_ACTION_CONFIRMATION_MESSAGE":
            return [...messages, oFetch(action, "message")];
        case "HIDE_USER_ACTION_CONFIRMATION_MESSAGE":
            return messages.filter(function(message){
                return message !== oFetch(action, "message");
            })
    }
    return messages;
}
