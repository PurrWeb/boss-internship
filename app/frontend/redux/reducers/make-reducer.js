import _ from "underscore"
import {registerActionCreator, registerActionType, actionTypes} from "../actions"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import * as backendData from "~lib/backend-data/process-backend-objects"

var handledActionTypes = [];

export default function makeReducer(actionHandlers, options){
    var defaultOptions = {
        initialState: {}
    }
    var usedOptions = _.extend({}, defaultOptions, options);

    for (var actionHandlerActionType in actionHandlers){
        handledActionTypes.push(actionHandlerActionType);
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

export function validateReducers(){
    handledActionTypes.forEach(function(actionType){
        if (!actionTypes[actionType]) {
            throw Error("Trying to handle non-existent action " + actionType)
        }
    })

}

export function makeHandlerForGenericReplaceAction(collectionName) {
    var multiItemActionNamePostfix = utils.makeAllCapsSnakeCase(collectionName)
    var replaceAllActionType = "REPLACE_ALL_" + multiItemActionNamePostfix;
    registerActionType(replaceAllActionType);
    registerActionCreator("replaceAll" + utils.capitalize(collectionName), function(data){
        var keys = _.keys(data);
        if (keys.length !== 1) {
            throw Error("Invalid data for genericReplaceAllItems, only one set of values allowed")
        }

        var collectionName = keys[0];
        var items = data[collectionName]
        return {
            type: replaceAllActionType,
            [collectionName]: items
        }
    })

    return function(state, action){
        if (collectionName in action) {
            return action[collectionName];
        } else {
            return state;
        }
    }
}

export function makeDefaultReducer(collectionName, additionalHandlers){
    if (additionalHandlers === undefined) {
        additionalHandlers = {};
    }

    var singleItemName = utils.getStringExceptLastCharacter(collectionName)
    var singleItemAactionNamePostfix = utils.makeAllCapsSnakeCase(singleItemName)
    var multiItemActionNamePostfix = utils.makeAllCapsSnakeCase(collectionName)

    var replaceAllActionType = "REPLACE_ALL_" + multiItemActionNamePostfix;
    var updateActionType = "UPDATE_" + singleItemAactionNamePostfix;
    var addActionType = "ADD_" + singleItemAactionNamePostfix;

    registerActionType(updateActionType)
    registerActionCreator("update" + utils.capitalize(singleItemName), function(options){
        var item = getItemFromActionOptions(options)
        return {
            type: updateActionType,
            [singleItemName]: item
        }
    });

    registerActionType(addActionType)
    registerActionCreator("add" + utils.capitalize(singleItemName), function(options){
        var item = getItemFromActionOptions(options);
        if (!backendData.objectHasBeenProcessed(item)){
            var processFunction = backendData["process" + utils.capitalize(singleItemName) + "Object"]
            item = processFunction(item)
        }
        return {
            type: addActionType,
            [singleItemName]: item
        }
    })

    function getItemFromActionOptions(options){
        var item = options[singleItemName];
        if (!item) {
            item = options;
        }
        if (!item) {
            throw Error("No item passed into update action for reducer " + collectionName)
        }
        return item;
    }

    return makeReducer({
        [replaceAllActionType]: makeHandlerForGenericReplaceAction(collectionName),
        [updateActionType]: function(state, action){
            var newItemData = oFetch(action, singleItemName);
            var item = state[newItemData.clientId]
            var newItem = _.clone(item);
            for (var key in newItemData){
                newItem[key] = newItemData[key];
            }
            var newState = {...state}
            newState[item.clientId] = newItem;
            return newState
        },
        [addActionType]: function(state, action){
            var item = oFetch(action, singleItemName)
            return Object.assign({}, state, {
                [item.clientId]: item
            })
        },
        ...additionalHandlers
    })
}
