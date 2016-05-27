import expect from "expect"
import makeDataHandler, {validateReducers} from "./make-data-handler"

describe.only("makeDataHandler", function(){
    beforeEach(function(){
        makeDataHandler.__Rewire__("actionTypes", {ADD: "ADD"});
    })
    afterEach(function(){
        makeDataHandler.__ResetDependency__("actionTypes")
    })
    it("Creates a reducer that handles the correct action", function(){
        var reducer = makeDataHandler("something", {
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
        var reducer = makeDataHandler("something", {});
        expect(function(){
            reducer(0, {type: "DOESNT_EXIST"})
        }).toThrow();
    })

    // it("Throws an exception when validating if an non-existent action is handled", function(){
    //     var reducer = makeDataHandler("something", {
    //         DOESNT_EXIST: function(){}
    //     })
    //     validateReducers()
    //     expect(function(){
    //         validateReducers()
    //     }).toThrow("unksadf");
    })
})

// describe("makeReducer - makeHandlerForGenericReplaceAction", function(){
//     var handler = makeHandlerForGenericReplaceAction("names")
//
//     it("Returns a modified function that returns the new value if the property name matches", function(){
//         var newState = handler([], {
//             type: "GENERIC_REPLACE_ALL_ITEMS",
//             names: ["John", "Emma"]
//         })
//         expect(newState).toEqual(["John", "Emma"])
//     })
//
//     it("If the property name doesn't match the original state is returned", function(){
//         var newState = handler([], {
//             type: "GENERIC_REPLACE_ALL_ITEMS",
//             oranges: ["Orange 1", "Orange 2"]
//         })
//         expect(newState).toEqual([]);
//     })
// })
