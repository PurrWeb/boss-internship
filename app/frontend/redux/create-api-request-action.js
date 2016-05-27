import _ from "underscore"

var registeredApiRequestActionCreators = {};
var apiRequestActionTypes = [];
apiRequestActionTypes.push("API_REQUEST_START")
apiRequestActionTypes.push("API_REQUEST_END")
apiRequestActionTypes.push("SET_COMPONENT_ERROR")

/**
The createApiRequestAction creates a an actionCreator that can be used to update
the state of API requests in the store.
It dispatches the following actions:
- API_REQUEST_START and API_REQUEST_END to store API requests that are in progress
- SET_COMPONENT_ERROR to assign the API error message to a component
- {requestType}_SUCCESS for the individual reducers to handle successful data updates.

Use errorHandlingComponent to specify which component should receive the error. Use
requestSourceComponent to keep track of the component that started the request (which
can be useful for showing spinners etc).

# Example


const addTodo = createApiRequestAction(
    "ADD_TODO",
    function(options, success, error, getState) {
        loadData(function(response){
            success({
                errorHandlingComponent: options.requestComponent,
                requestSourceComponent: options.requestComponent,
                ...response
            });
        }, 1000);
    }
);

addTodo({title: "Buy milk"});

 * @param  {string} requestType [description]
 * @param  {function} makeRequest - Function that is called to fetch the data.
   Takes three parameters:
   - options  Options passed into the action creator.
   - success  Callback to call once the data has been loaded
   - error    Callback to to call if the data couldn't be loaded.
   - getState    Function to get current store state
 * @param  {object} confirm - is called before the API call and cancels it if it doesn't return true
 * @return {function}   Asynchronous action creator.
 */
export default function createApiRequestAction(actionOptions){
    var { requestType, makeRequest } = actionOptions;

    const successType = requestType + "_SUCCESS";
    const startType = requestType + "_REQUEST_START";
    apiRequestActionTypes.push(successType);
    apiRequestActionTypes.push(startType);

    var actionCreator = generateActionCreator();
    registeredApiRequestActionCreators[requestType] = actionCreator;
    return actionCreator;

    function generateActionCreator(){
        return function(requestOptions){
            if (requestOptions === undefined) {
                requestOptions = {};
            }
            if (requestOptions.type || requestOptions.requestId || requestOptions.requestType) {
                throw new Error("The properties type, requestId and requestType can't be set");
            }

            var requestId = _.uniqueId();

            return function(dispatch, getState) {
                function success(successActionData){
                    dispatch([
                        {
                            type: successType,
                            ...successActionData
                        },
                        requestEndAction()
                    ]);
                    if (actionOptions.additionalSuccessActionCreator) {
                        dispatch(actionOptions.additionalSuccessActionCreator(successActionData, requestOptions));
                    }
                }
                function error(responseOptions){
                    var actions = [requestEndAction()];
                    if (requestOptions.errorHandlingComponent) {
                        actions.push(setComponentErrorAction(responseOptions.errors));
                    } else {
                        alert(responseOptions.errors.base.join("\n"));
                    }
                    dispatch(actions);
                }
                function setComponentErrorAction(errors){
                    return {
                        type: "SET_COMPONENT_ERROR",
                        componentId: requestOptions.errorHandlingComponent,
                        errors: errors
                    };
                }
                function apiRequestStartAction(){
                    return {
                        type: "API_REQUEST_START",
                        requestId: requestId,
                        requestType: requestType,
                        ...requestOptions
                    };
                }
                function requestTypeRequestStartAction(){
                    return {
                        type: startType,
                        ...requestOptions
                    }
                }
                function requestEndAction(){
                    return {
                        requestType: requestType,
                        type: "API_REQUEST_END",
                        requestId: requestId,
                        ...requestOptions
                    };
                }

                if (actionOptions.confirm) {
                    var confirmed = actionOptions.confirm(requestOptions, getState);
                    if (!confirmed) {
                        return; // Don't go ahead with request
                    }
                }

                dispatch([
                    apiRequestStartAction(),
                    requestTypeRequestStartAction(),
                    setComponentErrorAction(undefined)
                ]);
                makeRequest(requestOptions, success, error, getState);
            }

        }
    }
}

export { registeredApiRequestActionCreators }
export {apiRequestActionTypes}
