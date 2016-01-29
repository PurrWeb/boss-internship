import _ from "underscore"

/**
The createApiRequestAction creates a an actionCreator that can be used to update
the state of API requests in the store.
It dispatches the following actions:
- API_REQUEST_START and API_REQUEST_END to store API requests that are in progress
- SET_COMPONENT_ERROR to assign the API error message to a component
- {requestType}_SUCCESS for the individual reducers to handle successful data updates.

# Example

const actionTypes = {}
const addTodo = createApiRequestAction(
    "ADD_TODO",
    function(options, success, error, store) {
        loadData(function(response){
            success({
                requestComponent: options.requestComponent,
                ...response
            });
        }, 1000);
    },
    actionTypes
);

addTodo({title: "Buy milk"});

 * @param  {string} requestType [description]
 * @param  {function} makeRequest - Function that is called to fetch the data.
   Takes three parameters:
   - options  Options passed into the action creator.
   - success  Callback to call once the data has been loaded
   - error    Callback to to call if the data couldn't be loaded.
 * @param  {object} actionTypes - action types that are accessed in the reducers
 * @return {function}   Asynchronous action creator.
 */
export default function createApiRequestAction(requestType, makeRequest, actionTypes){
    actionTypes.API_REQUEST_START = "API_REQUEST_START";
    actionTypes.API_REQUEST_END = "API_REQUEST_END"
    actionTypes.SET_COMPONENT_ERROR = "SET_COMPONENT_ERROR";
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
            makeRequest(requestOptions, success, error, store);
        }

    }
}
