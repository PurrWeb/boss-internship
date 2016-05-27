import _ from "underscore"
import makeDataHandler from "./make-data-handler"

export default makeDataHandler("apiRequestInProgess", {
    API_REQUEST_START: handleAction,
    API_REQUEST_END: handleAction
})

function handleAction(state, action) {
    var newValue = requestTypeReducer(state[action.requestType], action);
    return Object.assign({}, state, {
        [action.requestType]: newValue
    });
}

var requestTypeReducer = makeDataHandler("apiRequestsInProgressByRequestType", {
    API_REQUEST_START: function(state, action){
        var value =  _.clone(action);
        delete value["type"];
        return [...state, value];
    },
    API_REQUEST_END: function(state, action){
        return  _.reject(state, {requestId: action.requestId});
    }
}).reducer
