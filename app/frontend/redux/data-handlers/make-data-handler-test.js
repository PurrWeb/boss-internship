import expect from "expect"
import makeDataHandler from "./make-data-handler"

describe("makeDataHandler", function(){
    it("Creates a reducer that handles the correct action", function(){
        var reducer = makeDataHandler("something", {
            ADD: function(state, action){
                return state + action.amount
            }
        }).reducer

        var newState = reducer(5, {
            type: "ADD",
            amount: 10
        })

        expect(newState).toBe(15)
    })

    it("Can create default action types and action creators and handled them", function(){
        var dataHandler = makeDataHandler("users", {
            ADD_USER: {
                action: "add"
            }
        })

        expect(dataHandler.actionTypes).toEqual(["ADD_USER"]);
        expect(dataHandler.actionCreators().addUser).toNotBe(undefined);

        var action = {
            type: "ADD_USER",
            user: {
                clientId: 55,
                name: "John"
            }
        }
        var newState = dataHandler.reducer({}, action)
        expect(newState[55].name).toBe("John")
    })

    it("Can generate a default update handler", function(){
        var dataHandler = makeDataHandler("users", {
            UPDATE_USER: {
                action: "update"
            }
        })

        var initialState = {
            33: {
                clientId: 33,
                name: "Sam"
            },
            18: {
                clientId: 18
            }
        }

        var action = {
            type: "UPDATE_USER",
            user: {
                clientId: 33,
                name: "Sam Jones"
            }
        }

        var expectedState = {
            33: {
                clientId: 33,
                name: "Sam Jones"
            },
            18: {
                clientId: 18
            }
        }

        expect(dataHandler.reducer(initialState, action)).toEqual(expectedState)
    })

    it("Can generate a default update action creator that can handle multiple object to be updated", function(){
        var dataHandler = makeDataHandler("users", {
            UPDATE_USERS: {
                generateActionCreator: false,
                action: "update"
            }
        })

        var initialState = {
            33: {
                clientId: 33,
                name: "Sam"
            },
            18: {
                clientId: 18,
                name: "Sally"
            }
        }

        var action = {
            type: "UPDATE_USERS",
            users: [
                {
                    clientId: 33,
                    name: "Sam Jones"
                },
                {
                    clientId: 18,
                    name: "Sally Smith"
                }
            ]
        }

        var expectedState = {
            33: {
                clientId: 33,
                name: "Sam Jones"
            },
            18: {
                clientId: 18,
                name: "Sally Smith"
            }
        }

        expect(dataHandler.reducer(initialState, action)).toEqual(expectedState)
    })

    it("Doesn't attempt to handle an action if the bailIf method returns true", function(){
        var dataHandler = makeDataHandler("users", {
            ADD_USER: {
                action: "add",
                shouldIgnoreAction: function(action){
                    return action.user === null;
                }
            }
        })

        var action = {
            type: "ADD_USER",
            user: null
        }

        var newState;

        expect(function(){
            newState = dataHandler.reducer({}, action);
        }).toNotThrow();

        expect(newState).toEqual({})
    })
})
