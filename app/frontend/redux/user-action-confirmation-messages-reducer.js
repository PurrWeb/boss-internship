import { actionTypes } from "./actions"
import oFetch from "o-fetch"

export default function userActionConfirmationMessages(messages=[], action){
    switch(action.type){
        case actionTypes.SHOW_USER_ACTION_CONFIRMATION_MESSAGE:
            return [...messages, oFetch(action, "message")];
    }
    return messages;
}