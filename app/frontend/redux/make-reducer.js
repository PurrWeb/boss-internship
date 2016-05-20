import _ from "underscore"

export default function makeReducer(actionHandlers, options){
    var defaultOptions = {
        initialState: {}
    }
    var usedOptions = _.extend({}, defaultOptions, options);

    return function(state, action){
        if (state === undefined) {
            state = usedOptions.initialState;
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
