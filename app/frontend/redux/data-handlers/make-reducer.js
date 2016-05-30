import _ from "underscore"

export default function makeReducer(actionHandlers, options){
    var defaultOptions = {
        initialState: {}
    }
    var usedOptions = _.extend({}, defaultOptions, options);

    return function(state, action){
        if (state === undefined){
            state = usedOptions.initialState;
        }
        if (action.type.indexOf("@@") !== -1){
            // Internal Redux actions that should be ignored
            // without throwin an exception
            return state;
        }

        var actionHandler = actionHandlers[action.type];
        if (actionHandler) {
            return actionHandler(state, action);
        }

        var catchAllActionHandler = actionHandlers["*"];
        if (catchAllActionHandler){
            return catchAllActionHandler(state, action);
        }

        return state;
    }
}
