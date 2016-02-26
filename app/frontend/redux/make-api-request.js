import _ from "underscore"
import utils from "~lib/utils"
import {API_ROOT} from "~lib/routes"
import oFetch from "o-fetch"

/*
apiOptions:
- method (required) - string or function that returns a string
- path (required) - string or function that returns a string
- data (required) - string or function that returns a string
- getSuccessActionData
*/
export default function makeApiRequest(apiOptions){
    return function(requestOptions, success, error, state) {
        function resolveFunctionParameter(parameterValue){
            if (typeof parameterValue === "function") {
                return parameterValue(requestOptions, state);
            }
            return parameterValue
        };

        requestOptions = _.clone(requestOptions);

        var [method, path, data] = oFetch(apiOptions, "method", "path", "data")
        method = resolveFunctionParameter(method);
        path = resolveFunctionParameter(path);
        data = resolveFunctionParameter(data);

        $.ajax({
           url: API_ROOT + path,
           method: method,
           data: data
        }).then(function(responseData){    
            var actionData = apiOptions.getSuccessActionData(responseData, requestOptions);
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