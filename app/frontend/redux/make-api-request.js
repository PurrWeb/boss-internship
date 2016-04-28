import _ from "underscore"
import utils from "~lib/utils"
import {API_ROOT} from "~lib/routes"
import oFetch from "o-fetch"

/*
apiOptions:
- method (required) - string or function that returns a string
- path (required) - string or function that returns a string
- data (optional) - object or function that returns an object
- getSuccessActionData
*/
export default function makeApiRequest(apiOptions){
    return function(requestOptions, success, error, getState) {
        function resolveFunctionParameter(parameterValue){
            if (typeof parameterValue === "function") {
                return parameterValue(requestOptions, getState);
            }
            return parameterValue
        };

        requestOptions = _.clone(requestOptions);

        var [method, path] = oFetch(apiOptions, "method", "path");
        method = resolveFunctionParameter(method);
        path = resolveFunctionParameter(path);
        var data = resolveFunctionParameter(apiOptions.data);
        var accessToken = resolveFunctionParameter(apiOptions.accessToken)

        if (typeof accessToken === "undefined") {
            makeRequest(window.boss.access_token);
        } else if (typeof accessToken === "string") {
            makeRequest(accessToken)
        } else if (maybeAccessToken.pin && maybeAccessToken.staffMemberServerId) {
            makeRequestForAccessToken({
                requestData: {
                    apiKey: "F7AC8662738C9823E7410D1B5E720E4B",
                    pin: maybeAccessToken.pin,
                    staffMemberServerId: maybeAccessToken.staffMemberServerId
                },
                success: function(data){
                    makeRequest(data.access_token)
                },
                error: function(){
                    debugger
                }
            });
        } else {
            throw Error("Invalid");
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
                var actionData = apiOptions.getSuccessActionData(responseData, requestOptions, getState);
                copyComponentInformationFromRequestOptions(actionData, requestOptions);
                success(actionData);
            }, function(response, textStatus){
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
            });
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
        method: "post",
        url: API_ROOT + "sessions",
        data: {
            api_key: requestData.apiKey,
            staff_member_id: requestData.staffMemberServerId,
            staff_member_pin: requestData.pin
        }
    }).then(success, error)
}

