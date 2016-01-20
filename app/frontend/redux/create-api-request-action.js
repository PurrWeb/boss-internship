import _ from "underscore"

export default function createApiRequestActionFactory(actionTypes) {
	actionTypes.API_REQUEST_START = "API_REQUEST_START";
	actionTypes.API_REQUEST_END = "API_REQUEST_END"
	actionTypes.SET_COMPONENT_ERROR = "SET_COMPONENT_ERROR";
	
	return function createApiRequestAction(requestType, makeRequest){
	    const SUCCESS_TYPE = requestType + "_SUCCESS";
	    actionTypes[SUCCESS_TYPE] = SUCCESS_TYPE;

	    return function(requestOptions){
	        if (requestOptions.type || requestOptions.requestId || requestOptions.requestType) {
	            throw "The properties type, requestId and requestType can't be set";
	        }

	        var requestId = _.uniqueId();

	        return function(dispatch) {
	            function success(responseOptions){
	                dispatch([
	                	{
	                    	type: SUCCESS_TYPE,
	                    	...responseOptions
	                	},
	                	requestEndAction()
	                ]);
	            }
	            function error(responseOptions){
	            	dispatch([
	            		requestEndAction(),
	            		setComponentErrorAction(responseOptions.errors)
	            	]);
	            }
	            function setComponentErrorAction(errors){
	                return {
	                    type: actionTypes.SET_COMPONENT_ERROR,
	                    componentId: requestOptions.requestComponent,
	                    errors: errors
	                };
	            }
	            function requestStartAction(){
	                return {
	                    type: actionTypes.API_REQUEST_START,
	                    requestId: requestId,
	                    requestType: requestType,
	                    ...requestOptions
	                };
	            }
	            function requestEndAction(){
	                return {
	                    requestType: requestType,
	                    type: actionTypes.API_REQUEST_END,
	                    requestId: requestId,
	                    ...requestOptions
	                };
	            }
	            
	            dispatch([
	            	requestStartAction(),
	            	setComponentErrorAction(undefined)
	            ]);
	            makeRequest(requestOptions, success, error)
	        }

	    }
	}
}
