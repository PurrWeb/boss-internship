import createApiRequestAction from "./create-api-request-action";
import expect from "expect"

function dispatchDoSomething(makeRequest, actionCreatorOptions){
	console.log("dispatchDoSth")
	var dispatch = expect.createSpy();
	var actionTypes = {};
	var actionCreator = createApiRequestAction("DO_SOMETHING", makeRequest, actionTypes);
	actionCreator(actionCreatorOptions)(dispatch);
	console.log("dispatchDoSth end")
	return dispatch;
}

describe("createApiRequestAction", function(){
	it("Calls makeRequest with the requestOptions that were passed in", function(){
		var makeRequest = expect.createSpy();
		var dispatch = dispatchDoSomething(makeRequest, {value: 99});
		expect(makeRequest.calls[0].arguments[0]).toEqual({value: 99});
	});

	it("Dispatches API_REQUEST_START and SET_COMPONENT_ERROR actions when I start a request", function(){
		var dispatch = dispatchDoSomething(function(){}, {})
		expect(dispatch).toHaveBeenCalled();
		var actionObjects = dispatch.calls[0].arguments[0];
		expect(actionObjects[0].type).toEqual("API_REQUEST_START");
		expect(actionObjects[1].type).toEqual("SET_COMPONENT_ERROR");
	});
	
	it("Dispatches API_REQUEST_END and DO_STH_SUCCESS when a request succeeds", function(){
		var makeRequest = function(options, success, error){
			success();
		};
		var dispatch = dispatchDoSomething(makeRequest, {});

		var actionObjects = dispatch.calls[1].arguments[0];
		expect(actionObjects[0].type).toEqual("DO_SOMETHING_SUCCESS");
		expect(actionObjects[1].type).toEqual("API_REQUEST_END");
	});

	it("Dispatches API_REQUEST_END and SET_COMPONENT_ERROR when a request fails", function(){
		var makeRequest = function(options, success, error){
			error({message: "It went wrong"});
		};
		var dispatch = dispatchDoSomething(makeRequest, {});

		var actionObjects = dispatch.calls[1].arguments[0];
		expect(actionObjects[0].type).toEqual("API_REQUEST_END");
		expect(actionObjects[1].type).toEqual("SET_COMPONENT_ERROR");
	});
});