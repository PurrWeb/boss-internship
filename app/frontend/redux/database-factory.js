import { combineReducers } from "redux"

function DatabaseFactory(){
    this.actionTypes = [];
    this.actionCreators = {};
    this.reducers = {}
}
DatabaseFactory.prototype = {
    registerActionTypes: function(actionTypes){
        actionTypes.forEach((actionType) =>
            this.actionTypes.push(actionType)
        )
    },
    registerActionCreator(name, actionCreatorFunction) {
        if (this.actionCreators[name] !== undefined) {
            throw Error("Action creator " + name + " already exists")
        }
        this.actionCreators[name] = actionCreatorFunction;
    },
    registerActionCreators: function(actionCreators){
        for (var name in actionCreators){
            this.registerActionCreator(name, actionCreators[name]);
        }
    },
    registerReducer(name, reducerFunction){
        if (this.reducers[name] !== undefined){
            throw Error("Reducer " + name + " already exists")
        }
        this.reducers[name] = reducerFunction;
    },
    validate: function(){

    },
    getActionTypes: function(){
        this.validate()
        return this.actionTypes
    },
    getActionCreators: function(){
        this.validate();
        return this.actionCreators
    },
    getRootReducer: function(){
        this.validate();
        return combineReducers(this.reducers)
    }
}

export default DatabaseFactory
