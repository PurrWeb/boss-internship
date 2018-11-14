import _ from "underscore"
import actions from "~/redux/actions"

var registeredApiRequestActionCreators = {};
var apiRequestActionTypes = [];
apiRequestActionTypes.push("API_REQUEST_START")
apiRequestActionTypes.push("API_REQUEST_END")
apiRequestActionTypes.push("SET_COMPONENT_ERROR")

/**
The createApiRequestActionCreator creates a an actionCreator that can be used to update
the state of API requests in the store.
It dispatches the following actions:
- API_REQUEST_START and API_REQUEST_END to store API requests that are in progress
- SET_COMPONENT_ERROR to assign the API error message to a component
- {requestType}_SUCCESS for the individual reducers to handle successful data updates.

Use errorHandlingId in the action creator options to specify which component
should receive the error. Use requestSourceComponent to keep track of the
component that started the request (which can be useful for showing spinners etc).

# Example

const addTodo = createApiRequestActionCreator({
    requesType: "ADD_TODO",
    makeRequest: function(options, success, error, getState) {
        loadData(function(response){
            success(response);
        })
    }
});

addTodo({title: "Buy milk"});

 * @param  {string} requestType [description]
 * @param  {function} makeRequest - Function that is called to fetch the data.
   makeRequest is passed four parameters parameters:
   - options  Options passed into the action creator.
   - success  Callback to call once the data has been loaded
   - error    Callback to to call if the data couldn't be loaded.
   - getState    Function to get current store state
 * @param  {function} confirm - is called before the API call and cancels it if it doesn't return true
 * @param {function} additionalSuccessActionCreator - can be used to dispatch other
    actions in addition to the _SUCCESS action
 * @return {function}   Asynchronous action creator.
 */
export default function createApiRequestActionCreator(actionOptions){
    var { requestType, makeRequest } = actionOptions;

    const successType = requestType + "_SUCCESS";
    const failureType = requestType + "_FAILURE"
    const startType = requestType + "_REQUEST_START";
    apiRequestActionTypes.push(successType);
    apiRequestActionTypes.push(failureType);
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
                    var actionsArr = [requestEndAction()];
                    actionsArr.push({
                        type: failureType,
                        ...responseOptions,
                        requestOptions
                    });

                    if (requestOptions.errorHandlingId) {
                        actionsArr.push(setComponentErrorAction(responseOptions.errors));
                    } else if (requestType === 'CLOCK_IN_OUT_APP_ENTER_USER_MODE') {
                        const {userMode, staffMemberObject} = requestOptions;
                        const errorMessage = responseOptions.errors.base ?
                            responseOptions.errors.base.join("\n") :
                            JSON.stringify(responseOptions.errors);

                        const onRetryClick = function () {
                            dispatch(actions().enterUserModeWithConfirmation({userMode, staffMemberObject}));
                        };

                        dispatch(actions().showWrongPinMessage(errorMessage, 'WRONG_PIN', onRetryClick));
                    } else {
                        if (responseOptions.errors && responseOptions.errors.base){
                            alert(responseOptions.errors.base.join("\n"));
                        } else {
                            const {requestStatus} = responseOptions;
                            if (requestStatus !== 401) {
                                alert(JSON.stringify(responseOptions.errors));
                            }
                        }
                    }

                    dispatch(actionsArr);
                }
                function setComponentErrorAction(errors){
                    return {
                        type: "SET_COMPONENT_ERROR",
                        componentId: requestOptions.errorHandlingId,
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
