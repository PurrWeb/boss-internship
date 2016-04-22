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

        var [method, path, data] = oFetch(apiOptions, "method", "path")
        method = resolveFunctionParameter(method);
        path = resolveFunctionParameter(path);
        data = resolveFunctionParameter(apiOptions.data);


        var accessToken;
        if (apiOptions.accessToken !== undefined){
            accessToken = apiOptions.accessToken;
        } else {
            accessToken = window.boss.access_token;
        }
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
    // Takes data about the request source component that was part of the request and 
    // copies it over to the target.
    function copyComponentInformationFromRequestOptions(target, requestOptions){
        target.errorHandlingComponent = requestOptions.errorHandlingComponent;
        target.requestSourceComponent = requestOptions.requestSourceComponent;
    }
}