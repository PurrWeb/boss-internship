import React from "react"
import Spinner from "~components/spinner"

export default class KeyDialog extends React.Component {
    render(){
        var buttonOrSpinner;
        if (this.props.loadDataInProgress) {
            buttonOrSpinner = <Spinner />
        } else {
            buttonOrSpinner = <button type="submit" className="btn btn-primary"
                data-test-marker-api-key-button>
                Load Clock In/Out page
            </button>
        }
        return <form onSubmit={(e) => {
                e.preventDefault();
                if (this.apiKeyInput.value != null && this.apiKeyInput.value != "") {
                  this.props.onApiKeySelected(this.apiKeyInput.value)
                }
            }}
                data-test-marker-key-dialog-form
            >
            <label>Enter key</label><br/>
            <input
                type="text"
                ref={(input) => this.apiKeyInput = input}></input>
            <br/><br/>
            {buttonOrSpinner}
        </form>
    }
}
