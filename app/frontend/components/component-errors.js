import React from "react"
import utils from "~lib/utils"

export default class ComponentErrors extends React.Component {
    static propTypes = {
        errors: React.PropTypes.object
    }
    render(){
        if (!this.props.errors) {
            return null;
        }

        var errorMessages = this.getErrorMessages();

        var errorComponents = null;
        if (errorMessages.length === 1) {
            errorComponents = <div>{errorMessages[0]}</div>;
        } 
        if (errorMessages.length > 1) {
            let messageComponents = errorMessages.map((message) => <li>{message}</li>);
            errorComponents = <ul>
                {messageComponents}
            </ul>
        }

        return <div className="alert alert-danger">
            {errorComponents}
        </div>
    }
    getErrorMessages(){
        var {errors} = this.props;

        var errorMessages = [];
        // Make sure base errors appear first in the list
        if ("base" in errors) {
            errorMessages = errorMessages.concat(this.getFieldErrors("base"));
        }
        for (var fieldName in errors) {
            if (fieldName === "base") {
                continue;
            }
            errorMessages = errorMessages.concat(this.getFieldErrors(fieldName));
        }

        return errorMessages;
    }
    getFieldErrors(fieldName) {
        var {errors} = this.props;

        var fieldErrorMessages = [];
        errors[fieldName].forEach(function(message, i){
            message = utils.capitalizeFirstCharacter(message);
            if (fieldName !== "base") {
                message = utils.capitalizeFirstCharacter(fieldName) + ": " + message;
            }
            fieldErrorMessages.push(message);
        });
        return fieldErrorMessages;
    }
}