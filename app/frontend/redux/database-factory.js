import { combineReducers } from "redux"
import _ from "underscore"
import utils from "~lib/utils"

/*
    Collects action types, action creators and reducers and then
    exports them.

    When exporting it also validates that all handled action types
    actually exist.
*/
export default class DatabaseFactory {
    constructor(){
        this._actionTypes = [];
        this._actionCreators = {};
        this._reducers = {}
        this._handledActionTypesByReducer = {};
    }
    registerActionTypes(actionTypes){
        actionTypes.forEach((actionType) =>
            this._actionTypes.push(actionType)
        )
    }
    registerActionCreator(name, actionCreatorFunction) {
        if (this._actionCreators[name] !== undefined) {
            throw Error("Action creator " + name + " already exists")
        }
        this._actionCreators[name] = actionCreatorFunction;
    }
    registerActionCreators(actionCreators){
        for (var name in actionCreators){
            this.registerActionCreator(name, actionCreators[name]);
        }
    }
    _registerReducer(name, reducerFunction){
        if (this._reducers[name] !== undefined){
            throw Error("Reducer " + name + " already exists")
        }
        this._reducers[name] = reducerFunction;
    }
    registerDataHandler(dataHandler){
        this._registerReducer(dataHandler.collectionName, dataHandler.reducer, dataHandler.handledActionTypes);
        this._handledActionTypesByReducer[dataHandler.collectionName] = dataHandler.handledActionTypes
        this.registerActionTypes(dataHandler.actionTypes)
        this.registerActionCreators(dataHandler.actionCreators)
    }
    _validateReducers(){
        var catchAllActionType = "*";

        for (var collectionName in this._handledActionTypesByReducer){
            var handledActionTypes = this._handledActionTypesByReducer[collectionName];
            handledActionTypes.forEach((actionType) => {
                var typeWasRegistered = _(this._actionTypes).contains(actionType);
                var typeIsCatchAll = actionType === "*"
                if (!typeWasRegistered && !typeIsCatchAll){
                    throw Error(`Trying to handle non-existent action type ${actionType} in reducer ${collectionName}`)
                }
            })
        }
    }
    _validate(){
        this._validateReducers();
    }
    getActionTypes(){
        this._validate()
        return this._actionTypes
    }
    getActionCreators(){
        this._validate();
        return this._actionCreators
    }
    _hasActionType(actionType){
        var actionIsInternalReduxAction = utils.stringContains(actionType, "@@")
        if (actionIsInternalReduxAction){
            return true;
        }
        return _(this._actionTypes).contains(actionType)
    }
    getRootReducer(){
        var self = this;
        this._validate();
        var rootReducer = combineReducers(this._reducers)
        return function(state, action){
            if (!self._hasActionType(action.type)){
                throw Error("Dispatched non-existent action type " + action.type)
            }
            return rootReducer(state, action)
        }
    }
}
