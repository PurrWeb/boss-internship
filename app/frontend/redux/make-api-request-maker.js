import _ from "underscore"
import utils from "~lib/utils"
import {getApiRoot, apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"

/*
Returns a function that when called makes an API request. It then calls either
its `success` or `error` parameter. You can use the generated function as the
makeRequest parameter for createApiRequestActionCreator.
apiOptions:
- method (required) - string or function that returns a string
- path (required) - string or function that returns a string
- data (optional) - object or function that returns an object
- needsApiKey (optional) - indicates whether the api key should be added to the request data
- doesntNeedAccessToken (optional) - make the API request without attempting to find an access to
- accessToken (optional) - string or function that returns either a token string
  or an object with a pin and staffMemberServerId, or an object with an api_key
- getSuccessActionData
*/
export default function makeApiRequestMaker(apiOptions){
    return function(requestOptions, success, error, getState) {
        requestOptions = _.clone(requestOptions);

        var [method, path] = oFetch(apiOptions, "method", "path");
        method = resolveFunctionParameter(method);
        path = resolveFunctionParameter(path);
        var data = resolveFunctionParameter(apiOptions.data);
        if (apiOptions.needsApiKey){
            data.api_key = getApiKey();
        }

        getAccessToken(function(accessToken){
            makeRequest(accessToken)
        })

        function getAccessToken(callback){
            if (apiOptions.doesntNeedAccessToken){
                callback(null);
                return;
            }

            var accessToken = requestOptions.accessToken;
            if (!accessToken) {
                accessToken = resolveFunctionParameter(apiOptions.accessToken)
            }

            if (typeof accessToken === "undefined") {
                callback(window.boss.access_token);
            } else if (typeof accessToken === "string") {
                callback(accessToken)
            } else if (accessToken.pin !== undefined && accessToken.staffMemberServerId !== undefined
            ||
            accessToken.api_key !== undefined) {
                makeRequestForAccessToken({
                    requestData: {
                        apiKey: getApiKey(),
                        pin: accessToken.pin,
                        staffMemberServerId: accessToken.staffMemberServerId
                    },
                    success: function(data){
                        callback(data.access_token)
                    },
                    error: function(response, textStatus){
                        failApiRequest(response, textStatus, "accessTokenRequest")
                    }
                });
            } else {
                throw Error("Invalid");
            }
        }

        function resolveFunctionParameter(parameterValue){
            if (typeof parameterValue === "function") {
                return parameterValue(requestOptions, getState);
            }
            return parameterValue
        };

        function getApiKey(){
            return getState().apiKey;
        }

        function makeRequest(accessToken){
            var headers = {
                Authorization: 'Token token="' + accessToken + '"'
            }

            var contentType;
            if (method === "GET") {
                contentType = "application/x-www-form-urlencoded"
            } else {
                data = JSON.stringify(data)
                contentType = "application/json"
            }
            $.ajax({
               url: getApiRoot() + path,
               method: method,
               data,
               headers,
               contentType
            }).then(function(responseData){
                if (responseData == ""){
                    responseData = {}
                }
                var actionData = apiOptions.getSuccessActionData(responseData, requestOptions, getState);
                copyComponentInformationFromRequestOptions(actionData, requestOptions);
                success(actionData);
            }, function(response, textStatus){
                failApiRequest(response, textStatus, "dataRequest")
            });
        }

        function failApiRequest(response, textStatus, failedRequestType) {
            if (failedRequestType !== "dataRequest" && failedRequestType !== "accessTokenRequest") {
                throw Error("Invalid failedRequestType " + failedRequestType)
            }

            var { responseText } = response;
            var responseData = null;
            if (utils.stringIsJson(responseText)) {
                responseData = JSON.parse(responseText);
            } else {
                responseData = {
                    errors: {
                        base: [textStatus + ' - ' + response.status, responseText]
                    }
                }
            }

            copyComponentInformationFromRequestOptions(responseData, requestOptions);

            responseData.requestStatus = response.status;
            error(responseData);
        }
    }
    // Takes data about the request source component that was part of the request and
    // copies it over to the target.
    function copyComponentInformationFromRequestOptions(target, requestOptions){
        target.errorHandlingId = requestOptions.errorHandlingId;
        target.requestSourceComponent = requestOptions.requestSourceComponent;
    }
}

function makeRequestForAccessToken({requestData, success, error}){
    $.ajax({
        method: apiRoutes.getSessionToken.method,
        url: getApiRoot() + apiRoutes.getSessionToken.getPath(),
        data: {
            api_key: requestData.apiKey,
            staff_member_id: requestData.staffMemberServerId,
            staff_member_pin: requestData.pin
        }
    }).then(success, error)
}

export function makeApiRequestMakerIfNecessary({tryWithoutRequest, makeRequest}){
    return function(requestOptions, success, error, getState){
        var actionData = tryWithoutRequest(requestOptions);
        if (actionData){
            success(actionData);
        } else {
            return makeRequest.apply(this, arguments);
        }
    }
}
