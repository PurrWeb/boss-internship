import { combineReducers } from "redux"
import _ from "underscore"

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
    validateReducers(){
        var catchAllActionType = "*";

        for (var collectionName in this._handledActionTypesByReducer){
            var handledActionTypes = this._handledActionTypesByReducer[collectionName];
            handledActionTypes.forEach((actionType) => {
                var typeWasRegistered = _(this._actionTypes).contains(actionType);
                var typeIsCatchAll = actionType === "*"
                if (!typeWasRegistered && !typeIsCatchAll){
                    throw Error(`Trying to handled non-existent action type ${actionType} in reducer ${collectionName}`)
                }
            })
        }
    }
    validate(){
        this.validateReducers();
    }
    getActionTypes(){
        this.validate()
        return this._actionTypes
    }
    getActionCreators(){
        this.validate();
        return this._actionCreators
    }
    getRootReducer(){
        this.validate();
        return combineReducers(this._reducers)
    }
}
