import _ from "underscore"
import utils from "~lib/utils"
import {API_ROOT} from "~lib/routes"

/*
apiOptions:
- method
- path
- data
*/
export default function makeApiRequest(apiOptions){
    return function(requestOptions, success, error, state) {
        function resolveFunctionParameter(optionsKey){
            if (typeof options[optionsKey] === "function") {
                options[optionsKey] = options[optionsKey](requestOptions, state);
            }
        };
        var options = _.clone(apiOptions);
        requestOptions = _.clone(requestOptions);
        ["method", "path", "data"].map(resolveFunctionParameter);

        if (options.validateOptions) {
            options.validateOptions(requestOptions);
        }

        $.ajax({
           url: API_ROOT + options.path,
           method: options.method,
           data: options.data
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