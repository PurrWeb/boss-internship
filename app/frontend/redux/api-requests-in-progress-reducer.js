import { actionTypes } from "./actions"
import _ from "underscore"

var initialState = {};
export default function apiRequestsInProgress(state=initialState, action){
    if (action.type === actionTypes.API_REQUEST_START || action.type === actionTypes.API_REQUEST_END) {
        var newValue = requestTypeReducer(state[action.requestType], action);
        console.log("New api", Object.assign({}, state, {
            [action.requestType]: newValue
        }))
        return Object.assign({}, state, {
            [action.requestType]: newValue
        });
    }
    return state;
}

function requestTypeReducer(state = [], action){
    switch (action.type) {
        case actionTypes.API_REQUEST_START:
            var value =  _.clone(action);
            delete value["type"];
            return [...state, value];
        case actionTypes.API_REQUEST_END:
            return  _.reject(state, {requestId: action.requestId});

    }
    return state;
}