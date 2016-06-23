import _ from "underscore"
import oFetch from "o-fetch"
import utils from "~lib/utils"
import makeReducer from "./make-reducer"
import * as backendData from "~lib/backend-data/process-backend-objects"

class DataHandler{
    constructor(options){
        this.collectionName = options.collectionName;
        this.reducer = options.reducer;
        this.actionTypes = options.actionTypes;
        this.actionCreators = options.actionCreators;
        this.handledActionTypes = options.handledActionTypes;
    }
}

/**
Generates a data handler object that combines the actionCreators and reducer for
a particular data type.

* collectionName
    Plural name of the object type, e.g. "users" or "clockInperiods"
    This is used to create action names and types, e.g. replaceALlUsers or ADD_USER
* actionHandlers
    An object that is converted to a reducer, by combining the reducers for each action type. Format:
    {
        ACTION_TYPE: function reducer(state, action, handlerHelpers){},
        ...
    }

    Instead of passing in a reducer function as the property value you can also pass in an object
    that is used to generate default reducer function. Example:
    {
        ADD_USERS: {
            action: "add"
        },
        ...
    }
    In addition to adding a handler to the reducer, the object above will also generate
    an action creator called `addUser`.
    Possible properties for the default handler object:
        - action - default action, e.g. "add", "replaceAll", "delete", "update", ...
        - shouldIgnoreAction - function that is called before calling the reducer function,
          if this function returns true the reducer function isn't called
        - debug - pause when the reducer function runs
* reducerOptions
    An object with any of these keys:
    - initialState (initial state of the reducer, e.g. [] or null, defaults to {})
*/
export default function makeDataHandler(collectionName, actionHandlers, reducerOptions){
    if (typeof collectionName !== "string") {
        throw Error("No or invalid collection name provided to makeDataHandler for " + collectionName)
    }

    var actionTypes = [];
    var actionCreators = {}

    for (let actionHandlerActionType in actionHandlers) {
        let handler = actionHandlers[actionHandlerActionType];
        let isDefaultHandlerObject = typeof handler === "object";
        if (isDefaultHandlerObject) {
            let defaultHandler = getDefaultActionHandler(collectionName, handler, actionHandlerActionType)
            if (defaultHandler.actionCreatorName){
                actionCreators[defaultHandler.actionCreatorName] = defaultHandler.actionCreator
            }

            if (defaultHandler.actionType) {
                actionTypes.push(defaultHandler.actionType)
            }
            actionHandlers[actionHandlerActionType] = function(state, action){
                if (handler.shouldIgnoreAction) {
                    if (handler.shouldIgnoreAction(action)){
                        return state;
                    }
                }
                if(handler.debug) {debugger;}
                return defaultHandler.handlerFunction.apply(this, [state, action, handlerHelpers])
            }
        } else {
            let handler = actionHandlers[actionHandlerActionType]
            actionHandlers[actionHandlerActionType] = function(state, action){
                return handler.apply(this, [state, action, handlerHelpers])
            }
        }
    }

    return new DataHandler({
        collectionName,
        reducer: makeReducer(actionHandlers, reducerOptions),
        actionTypes,
        actionCreators,
        // return handled types to allow validation later on
        handledActionTypes: _.keys(actionHandlers)
    })
}

var handlerHelpers = {
    update: function(state, updatedItemData){
        state = {...state}

        var item = oFetch(state, updatedItemData.clientId);

        var newItem = _.clone(item);
        for (var key in updatedItemData){
            newItem[key] = updatedItemData[key];
        }

        state[item.clientId] = newItem;
        return state
    },
    add: function(state, item){
        return Object.assign({}, state, {
            [item.clientId]: item
        })
    }
}

function getDefaultActionHandler(collectionName, genericHandlerInfo, handledActionType){
    var explicitlySetGenerateActionCreator = genericHandlerInfo.generateActionCreator !== undefined;
    var defaults = {
        generateActionCreator: true,
    }
    genericHandlerInfo = _.extend({}, defaults, genericHandlerInfo)

    var infoForGenerator = {
        collectionName,
        actionNames: getDefaultActionNames(collectionName)
    }

    var ret = {}

    var genericActionGenerator = genericActions[genericHandlerInfo.action]
    if (genericActionGenerator === undefined) {
        throw Error("No generic handler exists for '" + genericHandlerInfo.action + "' actions")
    }

    var canGenerateActionHandler = genericActionGenerator.getActionType && genericActionGenerator.makeDefaultActionCreator
    if (canGenerateActionHandler) {
        ret.actionType = genericActionGenerator.getActionType(infoForGenerator)
        if (genericHandlerInfo.generateActionCreator) {
            var actionCreatorInfo = genericActionGenerator.makeDefaultActionCreator(infoForGenerator);
            ret.actionCreatorName = actionCreatorInfo.actionCreatorName
            ret.actionCreator = actionCreatorInfo.actionCreator

            var actionTypeMatchesDefaultType = ret.actionType === handledActionType
            if (!actionTypeMatchesDefaultType && !explicitlySetGenerateActionCreator) {
                // Having the extra action creator could be confusing since it's
                // not actually used and the handler has custom functionality
                console.warn("Are you sure you want to create a", ret.actionCreatorName,
                "action? (This is part of the default handler for " + handledActionType + ")",
                "Explicitly pass in generateActionCreator: true/false to fix this warning")
            }
        }
    }
    ret.handlerFunction = genericActionGenerator.makeHandlerFunction(infoForGenerator);
    return ret;
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
            return function(state, action, handlerHelpers){
                var item = oFetch(action, actionNames.singleItemName)
                return handlerHelpers.add(state, item)
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
    "addOrUpdate": {
        makeHandlerFunction: function({actionNames, collectionName}){
            return function(state, action, handlerHelpers){
                var items = action[collectionName];
                if (!items) {
                    items = [oFetch(action, actionNames.singleItemName)];
                }
                items.forEach(function(item){
                    var itemExists = state[item.clientId];
                    if (itemExists) {
                        state = handlerHelpers.update(state, item)
                    } else {
                        state = handlerHelpers.add(state, item)
                    }
                })
                return state;
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
            return function(state, action, handlerHelpers){
                var newItemsData;
                if (action[actionNames.singleItemName]) {
                    newItemsData = [action[actionNames.singleItemName]]
                } else if (action[actionNames.collectionName]) {
                    newItemsData = action[actionNames.collectionName];
                } else {
                    throw Error("Data for update action not found")
                }

                newItemsData.forEach(function(newItemData){
                    state = handlerHelpers.update(state, newItemData)
                })

                return state
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
        processFunctionName,
        collectionName
    }
}
