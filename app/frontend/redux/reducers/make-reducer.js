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

export function makeHandlerForGenericAddAction(singleItemName){
    var singleItemActionNamePostfix = utils.makeAllCapsSnakeCase(singleItemName)
    var addActionType = "ADD_" + singleItemActionNamePostfix;
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

    return function(state, action){
        var item = oFetch(action, singleItemName)
        return Object.assign({}, state, {
            [item.clientId]: item
        })
    }
}

function getItemFromActionOptions(options, singleItemName){
    var item = options[singleItemName];
    if (!item) {
        item = options;
    }
    if (!item) {
        throw Error("No item passed into update action for item " + singleItemName)
    }
    return item;
}



export function makeDefaultReducer(collectionName, additionalHandlers){
    if (additionalHandlers === undefined) {
        additionalHandlers = {};
    }

    var singleItemName = utils.getStringExceptLastCharacter(collectionName)
    var singleItemActionNamePostfix = utils.makeAllCapsSnakeCase(singleItemName)
    var multiItemActionNamePostfix = utils.makeAllCapsSnakeCase(collectionName)

    var replaceAllActionType = "REPLACE_ALL_" + multiItemActionNamePostfix;
    var updateActionType = "UPDATE_" + singleItemActionNamePostfix;
    var addActionType = "ADD_" + singleItemActionNamePostfix;
    var deleteActionType = "DELETE_" + singleItemActionNamePostfix;

    registerActionType(updateActionType)
    registerActionCreator("update" + utils.capitalize(singleItemName), function(options){
        var item = getItemFromActionOptions(options, singleItemName)
        return {
            type: updateActionType,
            [singleItemName]: item
        }
    });

    registerActionType(deleteActionType)
    registerActionCreator("delete" + utils.capitalize(singleItemName), function(options){
        var item = getItemFromActionOptions(options, singleItemName);
        if (item.clientId === undefined) {
            throw Error("Needs client Id of object that should be deleted")
        }
        return {
            type: deleteActionType,
            [singleItemName]: {clientId: item.clientId}
        }
    });

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
        [addActionType]: makeHandlerForGenericAddAction(singleItemName),
        [deleteActionType]: function(state, action){
            var itemToDelete = oFetch(action, singleItemName);
            return _(state).reject(function(item){
                return itemToDelete.clientId === item.clientId;
            })
        },
        ...additionalHandlers
    })
}
