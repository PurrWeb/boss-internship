export default function createApiRequestActionFactory(actionTypes) {
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
	                dispatch({
	                    type: SUCCESS_TYPE,
	                    ...responseOptions
	                });
	                dispatchRequestEnd();
	            }
	            function error(responseOptions){
	                dispatchRequestEnd();
	                dispatchSetComponentError(responseOptions.errors);
	            }
	            function dispatchSetComponentError(errors){
	                dispatch({
	                    type: actionTypes.SET_COMPONENT_ERROR,
	                    componentId: requestOptions.requestComponent,
	                    errors: errors
	                })
	            }
	            function dispatchRequestStart(){
	                dispatch({
	                    type: actionTypes.API_REQUEST_START,
	                    requestId: requestId,
	                    requestType: requestType,
	                    ...requestOptions
	                });
	            }
	            function dispatchRequestEnd(){
	                dispatch({
	                    requestType: requestType,
	                    type: actionTypes.API_REQUEST_END,
	                    requestId: requestId,
	                    ...requestOptions
	                });
	            }
	            
	            dispatchRequestStart();
	            dispatchSetComponentError(undefined);
	            makeRequest(requestOptions, success, error)
	        }

	    }
	}
}
