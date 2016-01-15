import * as ACTIONS from "./actions.js"
export default function staffMembers(state=[], action){
    switch(action.type) {
        case ACTIONS.REPLACE_ALL_STAFF_MEMBERS:
            return action.staffMembers
    }
    return state;
}