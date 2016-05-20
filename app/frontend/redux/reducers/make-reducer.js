import _ from "underscore"
import actionTypes from "../actions/action-types"

export default function makeReducer(actionHandlers, options){
    var defaultOptions = {
        initialState: {}
    }
    var usedOptions = _.extend({}, defaultOptions, options);

    for (var actionHandlerAction in actionHandlers){
        if (!actionTypes[actionHandlerAction]) {
            throw Error("Trying to handle non-existent action " + actionHandlerAction)
        }
    }

    return function(state, action){
        if (state === undefined){
            state = usedOptions.initialState;
        }
        if (action.type.indexOf("@@") !== -1){
            // Internal Redux actions that should be ignored
            // without throwin an exception
            return state;
        }

        if (!actionTypes[action.type]) {
            throw Error("Action with type " + action.type + " doesn't exist");
        }

        var actionHandler = actionHandlers[action.type];
        if (actionHandler) {
            return actionHandler(state, action);
        }

        return state;
    }
}

export function makeHandlerForGenericReplaceAction(propertyName) {
    return function(state, action){
        if (propertyName in action) {
            return action[propertyName];
        } else {
            return state;
        }
    }
}
