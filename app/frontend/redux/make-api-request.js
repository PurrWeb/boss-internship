import _ from "underscore"
import utils from "~lib/utils"
import {API_ROOT, apiRoutes} from "~lib/routes"
import oFetch from "o-fetch"

/*
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
                makeRequest(accessToken)
            } else if (accessToken.pin && accessToken.staffMemberServerId
            ||
            accessToken.api_key) {
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
                        failApiRequest(response, textStatus)
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

            $.ajax({
               url: API_ROOT + path,
               method: method,
               data: data,
               headers
            }).then(function(responseData){
                if (responseData == ""){
                    responseData = {}
                }
                var actionData = apiOptions.getSuccessActionData(responseData, requestOptions, getState);
                copyComponentInformationFromRequestOptions(actionData, requestOptions);
                success(actionData);
            }, function(response, textStatus){
                failApiRequest(response, textStatus)
            });
        }

        function failApiRequest(response, textStatus) {
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

            error(responseData);
        }
    }
    // Takes data about the request source component that was part of the request and
    // copies it over to the target.
    function copyComponentInformationFromRequestOptions(target, requestOptions){
        target.errorHandlingComponent = requestOptions.errorHandlingComponent;
        target.requestSourceComponent = requestOptions.requestSourceComponent;
    }
}

function makeRequestForAccessToken({requestData, success, error}){
    $.ajax({
        method: apiRoutes.getSessionToken.method,
        url: API_ROOT + apiRoutes.getSessionToken.getPath(),
        data: {
            api_key: requestData.apiKey,
            staff_member_id: requestData.staffMemberServerId,
            staff_member_pin: requestData.pin
        }
    }).then(success, error)
}
