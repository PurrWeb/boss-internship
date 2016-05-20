export default function confirmationModal(state=null, action){
    switch(action.type) {
        case "SHOW_CONFIRMATION_MODAL":
            return action.payload;
        case "CANCEL_CONFIRMATION_MODAL":
            return null;
        case "COMPLETE_CONFIRMATION_MODAL":
            return null;
    }
    return state;
}
