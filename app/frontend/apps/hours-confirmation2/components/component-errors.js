import PropTypes from 'prop-types';
import React from "react"
import utils from "~/lib/utils"
import ErrorMessage from "./error-message"
import {connect} from "react-redux"

class ComponentErrors extends React.Component {
    static propTypes = {
        errors: PropTypes.object
    }
    render(){
        if (!this.props.errors) {
            return null;
        }

        var errorMessages = this.getErrorMessages();

        var errorComponents = null;
        if (errorMessages.length === 1) {
            errorComponents = <p className="boss-time-shift__error-text">{errorMessages[0]}</p>;
        }
        if (errorMessages.length > 1) {
            let messageComponents = errorMessages.map((message) => <p key={message} className="boss-time-shift__error-text">{message}</p>);
            errorComponents = <div style={{paddingLeft: 20}}>
                {messageComponents}
            </div>
        }

        var extraStyle = this.props.extraStyle;
        if (!extraStyle) {
            extraStyle = {}
        }
        return <div style={extraStyle}>
            <ErrorMessage>
                {errorComponents}
            </ErrorMessage>
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
            if (!message) {
                return;
            }
            if (typeof message !== "string") {
                if (_.isArray(message.base)) {
                    message = message.base.join(", ")
                } else {
                    try {
                        message = JSON.stringify(message)
                    } catch (e) {
                        message = "(Invalid error)"
                    }
                }
            }
            message = utils.capitalizeFirstCharacter(message);
            if (fieldName !== "base") {
                message = utils.capitalizeFirstCharacter(fieldName) + ": " + message;
            }
            fieldErrorMessages.push(message);
        });
        return fieldErrorMessages;
    }
}

function mapStateToProps(state, ownProps){
    if (ownProps.errorHandlingId) {
        return {
            errors: state.componentErrors[ownProps.errorHandlingId]
        }
    }
    return {}
}

export default connect(mapStateToProps)(ComponentErrors)
