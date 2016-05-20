import _ from "underscore"

var initialState = {};
export default function apiRequestsInProgress(state=initialState, action){
    if (action.type === "API_REQUEST_START" || action.type === "API_REQUEST_END") {
        var newValue = requestTypeReducer(state[action.requestType], action);
        return Object.assign({}, state, {
            [action.requestType]: newValue
        });
    }
    return state;
}

function requestTypeReducer(state = [], action){
    switch (action.type) {
        case "API_REQUEST_START":
            var value =  _.clone(action);
            delete value["type"];
            return [...state, value];
        case "API_REQUEST_END":
            return  _.reject(state, {requestId: action.requestId});

    }
    return state;
}
