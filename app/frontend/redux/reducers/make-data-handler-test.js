import expect from "expect"
import makeDataHandler from "./make-data-handler"

describe("makeReducer", function(){
    beforeEach(function(){
        makeReducer.__Rewire__("actionTypes", {ADD: "ADD"});
    })
    afterEach(function(){
        makeReducer.__ResetDependency__("actionTypes")
    })
    it("Creates a reducer that handles the correct action", function(){
        var reducer = makeReducer({
            ADD: function(state, action){
                return state + action.amount
            }
        })

        var newState = reducer(5, {
            type: "ADD",
            amount: 10
        })

        expect(newState).toBe(15)
    })

    it("Throws an exception when trying to handle a non-existent action", function(){
        var reducer = makeReducer({});
        expect(function(){
            reducer(0, {type: "DOESNT_EXIST"})
        }).toThrow();
    })

    it("Throws an exception when tring to define a handler for a non-existent action", function(){
        expect(function(){
            var reducer = makeReducer({
                DOESNT_EXIST: function(){}
            })
        }).toThrow();
    })
})

describe("makeReducer - makeHandlerForGenericReplaceAction", function(){
    var handler = makeHandlerForGenericReplaceAction("names")

    it("Returns a modified function that returns the new value if the property name matches", function(){
        var newState = handler([], {
            type: "GENERIC_REPLACE_ALL_ITEMS",
            names: ["John", "Emma"]
        })
        expect(newState).toEqual(["John", "Emma"])
    })

    it("If the property name doesn't match the original state is returned", function(){
        var newState = handler([], {
            type: "GENERIC_REPLACE_ALL_ITEMS",
            oranges: ["Orange 1", "Orange 2"]
        })
        expect(newState).toEqual([]);
    })
})
