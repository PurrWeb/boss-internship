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
})
