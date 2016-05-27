import { combineReducers } from "redux"

export default class DatabaseFactory {
    constructor(){
        this.actionTypes = [];
        this.actionCreators = {};
        this.reducers = {}
    }
    registerActionTypes(actionTypes){
        actionTypes.forEach((actionType) =>
            this.actionTypes.push(actionType)
        )
    }
    registerActionCreator(name, actionCreatorFunction) {
        if (this.actionCreators[name] !== undefined) {
            throw Error("Action creator " + name + " already exists")
        }
        this.actionCreators[name] = actionCreatorFunction;
    }
    registerActionCreators(actionCreators){
        for (var name in actionCreators){
            this.registerActionCreator(name, actionCreators[name]);
        }
    }
    registerReducer(name, reducerFunction){
        if (this.reducers[name] !== undefined){
            throw Error("Reducer " + name + " already exists")
        }
        this.reducers[name] = reducerFunction;
    }
    validate(){

    }
    getActionTypes(){
        this.validate()
        return this.actionTypes
    }
    getActionCreators(){
        this.validate();
        return this.actionCreators
    }
    getRootReducer(){
        this.validate();
        return combineReducers(this.reducers)
    }
}
