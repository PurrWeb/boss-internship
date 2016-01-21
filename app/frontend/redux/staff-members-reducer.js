import {actionTypes} from "./actions.js"
export default function staffMembers(state=[], action){
    switch(action.type) {
        case actionTypes.REPLACE_ALL_STAFF_MEMBERS:
            return action.staffMembers
    }
    return state;
}