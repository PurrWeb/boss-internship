import React from "react"
import ErrorMessage from "~/components/error-message"


export default class ValidationResult extends React.Component {
    render(){
        if (this.props.result.isValid) {
            return null;
        }
        return <ErrorMessage>
            {this.props.result.messages.map(
                (msg, i) => <div key={i}>{msg}</div>
            )}
        </ErrorMessage>
    }
}
