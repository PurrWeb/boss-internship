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
        expect(dataHandler.actionCreators.addUser).toNotBe(undefined);

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
})
