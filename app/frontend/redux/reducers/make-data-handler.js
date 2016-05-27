import _ from "underscore"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import makeReducer from "./make-reducer"
import * as backendData from "~lib/backend-data/process-backend-objects"

var handledActionTypes = [];

// makeDataHandler is generating a reducer, but default actions can also
// create new actions

export default function makeDataHandler(collectionName, actionHandlers, options){
    if (typeof collectionName !== "string") {
        throw Error("No or invalid collection name provided to makeDataHandler for " + collectionName)
    }

    // We keep track of all action types that are used so we can
    // later validate that all those actions actually exist
    for (var actionHandlerActionType in actionHandlers){
        handledActionTypes.push({
            type: actionHandlerActionType,
            collectionName
        });
    }

    var actionTypes = [];
    var actionCreators = {}

    for (var actionHandlerActionType in actionHandlers) {
        var handler = actionHandlers[actionHandlerActionType];
        var isDefaultHandlerObject = typeof handler === "object";
        if (isDefaultHandlerObject) {
            let defaultHandler = getDefaultActionHandler(collectionName, handler)
            if (defaultHandler.actionCreatorName){
                actionCreators[defaultHandler.actionCreatorName] = defaultHandler.actionCreator
            }

            if (defaultHandler.actionType) {
                actionTypes.push(defaultHandler.actionType)
            }
            actionHandlers[actionHandlerActionType] = defaultHandler.handlerFunction
        }
    }

    return {
        reducer: makeReducer(actionHandlers, options),
        actionTypes,
        actionCreators
    }
}


function getDefaultActionHandler(collectionName, genericHandlerInfo){
    var defaults = {
        generateActionCreator: true,
    }
    genericHandlerInfo = _.extend({}, defaults, genericHandlerInfo)

    var infoForGenerator = {
        collectionName,
        actionNames: getDefaultActionNames(collectionName)
    }

    var ret = {}

    if (genericHandlerInfo.generateActionCreator) {
        ret = genericActions[genericHandlerInfo.action].makeDefaultActionCreator(infoForGenerator);
    }
    ret.actionType = genericActions[genericHandlerInfo.action].getActionType(infoForGenerator)
    ret.handlerFunction = genericActions[genericHandlerInfo.action].makeHandlerFunction(infoForGenerator);
    return ret;
}

export function validateReducers(){
    handledActionTypes.forEach(function(actionHandler){
        if (!actionTypes[actionHandler.type]) {
            throw Error("Trying to handle non-existent action " + actionHandler.type + " in " + actionHandler.collectionName)
        }
    })
}

var genericActions = {
    "replaceAll": {
        getActionType: function({actionNames}){
            return actionNames.replaceAllActionType;
        },
        makeDefaultActionCreator({actionNames, collectionName}){
            return {
                actionCreatorName: actionNames.replaceAllActionName,
                actionCreator: function(data){
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
                }
            }
        },
        makeHandlerFunction({collectionName}){
            return function(state, action){
                return oFetch(action, collectionName);
            }
        }
    },
    "add": {
        getActionType: function({actionNames}){
            return actionNames.addActionType;
        },
        makeDefaultActionCreator({actionNames, collectionName}){
            return {
                actionCreatorName: actionNames.addActionName,
                actionCreator: function(options){
                var item = getItemFromActionOptions(options, actionNames.singleItemName);
                    if (!backendData.objectHasBeenProcessed(item)){
                        var processFunction = backendData[actionNames.processFunctionName]
                        item = processFunction(item)
                    }
                    return {
                        type: actionNames.addActionType,
                        [actionNames.singleItemName]: item
                    }
                }
            }
        },
        makeHandlerFunction({actionNames, collectionName}){
            return function(state, action){
                var item = oFetch(action, actionNames.singleItemName)
                return Object.assign({}, state, {
                    [item.clientId]: item
                })
            }
        }
    },
    "delete": {
        getActionType: function({actionNames}){
            return actionNames.deleteActionType;
        },
        makeDefaultActionCreator({actionNames, collectionName}){
            return {
                actionCreatorName: actionNames.deleteActionName,
                actionCreator: function(options){
                    var item = getItemFromActionOptions(options, actionNames.singleItemName);
                    if (item.clientId === undefined) {
                        throw Error("Needs client Id of object that should be deleted")
                    }
                    return {
                        type: actionNames.deleteActionType,
                        [actionNames.singleItemName]: {clientId: item.clientId}
                    }
                }
            }
        },
        makeHandlerFunction({actionNames, collectionName}){
            return function(state, action){
                var itemToDelete = oFetch(action, actionNames.singleItemName);
                return _(state).omit(function(item){
                    return itemToDelete.clientId === item.clientId;
                })
            }
        }
    },
    "update": {
        getActionType: function({actionNames}){
            return actionNames.updateActionType;
        },
        makeDefaultActionCreator({actionNames, collectionName}){
            return {
                actionCreatorName: actionNames.updateActionName,
                actionCreator: function(options){
                    var item = getItemFromActionOptions(options, actionNames.singleItemName)
                    return {
                        type: actionNames.updateActionType,
                        [actionNames.singleItemName]: item
                    }
                }
            }
        },
        makeHandlerFunction({actionNames, collectionName}){
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
    },
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

export function makeDefaultDataHandler(collectionName, additionalHandlers){
    if (additionalHandlers === undefined) {
        additionalHandlers = {};
    }

    var actionNames = getDefaultActionNames(collectionName)

    return makeDataHandler(collectionName, {
        [actionNames.replaceAllActionType]: {
            action: "replaceAll"
        },
        [actionNames.updateActionType]: {
            action: "update"
        },
        [actionNames.addActionType]: {
            action: "add"
        },
        [actionNames.deleteActionType]: {
            action: "delete"
        },
        ...additionalHandlers
    })
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
