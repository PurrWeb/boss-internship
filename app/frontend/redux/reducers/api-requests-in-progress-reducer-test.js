import expect from "expect"
import apiRequestsInProgressReducer from "./api-requests-in-progress-reducer"

describe("apiRequestsInProgressReducer", function(){
    it("Can keep track of an API request being started", function(){
        var initialState = {};
        var action = {
            type: "API_REQUEST_START",
            requestType: "LOAD_SOMETHING",
            requestId: 123
        };
        var expectedResultState = {
            LOAD_SOMETHING: [{
                requestType: "LOAD_SOMETHING",
                requestId: 123
            }]
        }

        expect(apiRequestsInProgressReducer(initialState, action)).toEqual(expectedResultState);
    });

    it("Removes an API request from the in progress list when the request has finished", function(){
        var initialState = {
            LOAD_SOMETHING: [{
                requestType: "LOAD_SOMETHING",
                requestId: 789
            }]
        };
        var action = {
            type: "API_REQUEST_END",
            requestType: "LOAD_SOMETHING",
            requestId: 789
        };
        var expectedResultState = {
            LOAD_SOMETHING: []
        }
        expect(apiRequestsInProgressReducer(initialState, action)).toEqual(expectedResultState);
    })
});