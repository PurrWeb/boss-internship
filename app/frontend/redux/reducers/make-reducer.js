import _ from "underscore"
import actionTypes, {registerActionType} from "../actions/action-types"
import {createActionCreator} from "../actions"
import oFetch from "o-fetch"
import utils from "~lib/utils"

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

export function makeDefaultReducer(propertyName){
    // simple reducer for data that isn't updated after initial load
    var singleItemName = utils.getStringExceptLastCharacter(propertyName)
    var actionNamePostfix = utils.makeAllCapsSnakeCase(singleItemName)

    var updateActionType = "UPDATE_" + actionNamePostfix;
    registerActionType(updateActionType)
    createActionCreator("update" + utils.capitalize(singleItemName), function(options){
        return {
            type: updateActionType,
            [singleItemName]: oFetch(options, singleItemName)
        }
    });

    return makeReducer({
        GENERIC_REPLACE_ALL_ITEMS: makeHandlerForGenericReplaceAction(propertyName),
        [updateActionType]: function(state, action){
            if (action[singleItemName] === undefined) {
                return state;
            }
            var newItemData = oFetch(action, singleItemName);
            var item = state[newItemData.clientId]
            var newItem = _.clone(item);
            for (var key in newItemData){
                newItem[key] = newItemData[key];
            }
            var newState = {...state}
            newState[item.clientId] = newItem;
            return newState
        }
    })
}
