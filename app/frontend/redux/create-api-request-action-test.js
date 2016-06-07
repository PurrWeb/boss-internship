import createApiRequestAction from "./create-api-request-action";
import expect from "expect"

function dispatchDoSomething(makeRequest, actionOptions, options){
	if (options=== undefined){
		options = {};
	}
	var {confirm, additionalSuccessActionCreator} = options;
	var dispatch = expect.createSpy();
	var actionTypes = {};
	var actionCreator = createApiRequestAction({
		requestType: "DO_SOMETHING",
		makeRequest,
		actionTypes,
		confirm,
		additionalSuccessActionCreator
	});
	function getState() {
		return {};
	}
	actionCreator(actionOptions)(dispatch, getState);
	return dispatch;
}

describe("createApiRequestAction", function(){
	it("Calls makeRequest with the requestOptions that were passed in", function(){
		var makeRequest = expect.createSpy();
		var dispatch = dispatchDoSomething(makeRequest, {value: 99});
		expect(makeRequest.calls[0].arguments[0]).toEqual({value: 99});
	});

	it("Dispatches API_REQUEST_START, DO_SOMETHING_REQUEST_START and SET_COMPONENT_ERROR actions when I start a request", function(){
		var dispatch = dispatchDoSomething(function(){}, {})
		expect(dispatch).toHaveBeenCalled();
		var actionObjects = dispatch.calls[0].arguments[0];
		expect(actionObjects[0].type).toEqual("API_REQUEST_START");
		expect(actionObjects[1].type).toEqual("DO_SOMETHING_REQUEST_START");
		expect(actionObjects[2].type).toEqual("SET_COMPONENT_ERROR");
	});
	
	it("Dispatches API_REQUEST_END and DO_SOMETHING_SUCCESS when a request succeeds", function(){
		var makeRequest = function(options, success, error){
			success();
		};
		var dispatch = dispatchDoSomething(makeRequest, {});

		var actionObjects = dispatch.calls[1].arguments[0];
		expect(actionObjects[0].type).toEqual("DO_SOMETHING_SUCCESS");
		expect(actionObjects[1].type).toEqual("API_REQUEST_END");
	});

	it("Dispatches API_REQUEST_END and SET_COMPONENT_ERROR when a request fails and an errorHandlingId is available", function(){
		var makeRequest = function(options, success, error){
			error({errors: {base: ["It went wrong"]}});
		};
		var dispatch = dispatchDoSomething(makeRequest, {errorHandlingId: 66});

		var actionObjects = dispatch.calls[1].arguments[0];
		expect(actionObjects[0].type).toEqual("API_REQUEST_END");
		expect(actionObjects[1].type).toEqual("SET_COMPONENT_ERROR");
	});

	it("Shows an alert box if a request fails without an errorHandlingId", function(){
		expect.spyOn(window, "alert");

		var makeRequest = function(options, success, error){
			error({errors: {base: ["It went wrong"]}});
		};
		var dispatch = dispatchDoSomething(makeRequest, {});

		expect(window.alert).toHaveBeenCalled();
	})

	it("Doesn't make an API request if `confirm` returns false", function(){
		var makeRequest = expect.createSpy();
		var confirm = () => false;
		var dispatch = dispatchDoSomething(makeRequest, {}, {confirm});

		expect(makeRequest).toNotHaveBeenCalled();		
	});

	it("Can dispatch another action in addition to the default success action", function(){
		var makeRequest = function(options, success, error){
			success();
		};
		var dispatch = dispatchDoSomething(makeRequest, {}, {
			additionalSuccessActionCreator: function(){
				return {
					type: "DO_ANOTHER_THING"
				}
			}
		});

		expect(dispatch.calls[2].arguments[0].type).toEqual("DO_ANOTHER_THING");
	})
});