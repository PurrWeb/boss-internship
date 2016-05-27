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

function getDefaultActionNames(collectionName){
    var singleItemName = utils.getStringExceptLastCharacter(collectionName)
    var singleItemActionNamePostfix = utils.makeAllCapsSnakeCase(singleItemName)
    var multiItemActionNamePostfix = utils.makeAllCapsSnakeCase(collectionName)

    var replaceAllActionType = "REPLACE_ALL_" + multiItemActionNamePostfix;
    var updateActionType = "UPDATE_" + singleItemActionNamePostfix;
    var addActionType = "ADD_" + singleItemActionNamePostfix;
    var deleteActionType = "DELETE_" + singleItemActionNamePostfix;

    var deleteActionName = "delete" + utils.capitalize(singleItemName);
    var replaceAllActionName = "replaceAll" + utils.capitalize(collectionName);
    var addActionName = "add" + utils.capitalize(singleItemName);
    var updateActionName = "update" + utils.capitalize(singleItemName);

    var processFunctionName = "process" + utils.capitalize(singleItemName) + "Object";

    return {
        singleItemName,
        replaceAllActionType,
        replaceAllActionName,
        updateActionType,
        updateActionName,
        addActionType,
        addActionName,
        deleteActionType,
        deleteActionName,
        processFunctionName
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
    var actionNames = getDefaultActionNames(collectionName)

    registerActionType(actionNames.replaceAllActionType);
    registerActionCreator(actionNames.replaceAllActionName, function(data){
        var keys = _.keys(data);
        if (keys.length !== 1) {
            throw Error("Invalid data for genericReplaceAllItems, only one set of values allowed")
        }

        var collectionName = keys[0];
        var items = data[collectionName]
        return {
            type:actionNames.replaceAllActionType,
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

export function makeHandlerForGenericAddAction(collectionName){
    var actionNames = getDefaultActionNames(collectionName)

    registerActionType(actionNames.addActionType)
    registerActionCreator(actionNames.addActionName, function(options){
        var item = getItemFromActionOptions(options, actionNames.singleItemName);
        if (!backendData.objectHasBeenProcessed(item)){
            var processFunction = backendData[actionNames.processFunctionName]
            item = processFunction(item)
        }
        return {
            type: actionNames.addActionType,
            [actionNames.singleItemName]: item
        }
    })

    return function(state, action){
        var item = oFetch(action, actionNames.singleItemName)
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

export function makeHandlerForGenericUpdateAction(collectionName){
    var actionNames = getDefaultActionNames(collectionName)
    registerActionType(actionNames.updateActionType)
    registerActionCreator(actionNames.updateActionName, function(options){
        var item = getItemFromActionOptions(options, actionNames.singleItemName)
        return {
            type: actionNames.updateActionType,
            [actionNames.singleItemName]: item
        }
    });

    return function(state, action){
        var newItemData = oFetch(action, actionNames.singleItemName);
        var item = state[newItemData.clientId]
        var newItem = _.clone(item);
        for (var key in newItemData){
            newItem[key] = newItemData[key];
        }
        var newState = {...state}
        newState[item.clientId] = newItem;
        return newState
    }
}

export function makeHandlerForGenericDeleteAction(collectionName, options){
    if (options === undefined){
        options = {}
    }
    var actionNames = getDefaultActionNames(collectionName)

    if (options.createDefaultActionCreator !== false){
        registerActionType(actionNames.deleteActionType)
        registerActionCreator(actionNames.deleteActionName, function(options){
            var item = getItemFromActionOptions(options, actionNames.singleItemName);
            if (item.clientId === undefined) {
                throw Error("Needs client Id of object that should be deleted")
            }
            return {
                type: actionNames.deleteActionType,
                [actionNames.singleItemName]: {clientId: item.clientId}
            }
        });
    }

    return function(state, action){
        var itemToDelete = oFetch(action, actionNames.singleItemName);
        return _(state).reject(function(item){
            return itemToDelete.clientId === item.clientId;
        })
    }

}

export function makeDefaultReducer(collectionName, additionalHandlers){
    if (additionalHandlers === undefined) {
        additionalHandlers = {};
    }

    var actionNames = getDefaultActionNames(collectionName)

    return makeReducer({
        [actionNames.replaceAllActionType]: makeHandlerForGenericReplaceAction(collectionName),
        [actionNames.updateActionType]: makeHandlerForGenericUpdateAction(collectionName),
        [actionNames.addActionType]: makeHandlerForGenericAddAction(collectionName),
        [actionNames.deleteActionType]: makeHandlerForGenericDeleteAction(collectionName),
        ...additionalHandlers
    })
}
