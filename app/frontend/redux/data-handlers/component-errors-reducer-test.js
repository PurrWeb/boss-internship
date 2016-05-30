import expect from "expect"
import componentErrorsReducer from "./component-errors-reducer"

componentErrorsReducer = componentErrorsReducer.reducer

describe("componentErrorsReducer", function(){
    it("Set the error value of a component", function(){
        var initialState = {};
        var action = {
            type: "SET_COMPONENT_ERROR",
            componentId: "some-id",
            errors: {
                something: "went wrong"
            }
        };
        var expectedResultState = {
            "some-id": {
                something: "went wrong"
            }
        }

        expect(componentErrorsReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Doesn't modify that state if no componentId is present", function(){
        var initialState = {};
        var action = {
            type: "SET_COMPONENT_ERROR",
            errors: {
                something: "went wrong"
            }
        };
        var expectedResultState = {};

        expect(componentErrorsReducer(initialState, action)).toEqual(expectedResultState);
    });
});
