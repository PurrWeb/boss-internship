import React from "react"
import { connect } from "react-redux"
import { setApiKey, clockInOutAppLoadAppData } from "~redux/actions"
import { selectClockInOutLoadAppDataIsInProgress } from "~redux/selectors"
import Spinner from "~components/spinner"

class KeyDialog extends React.Component {
    render(){
        var buttonOrSpinner;
        if (this.props.loadDataInProgress) {
            buttonOrSpinner = <Spinner />
        } else {
            buttonOrSpinner = <button type="submit" className="btn btn-default"
                data-test-marker-api-key-button>
                Load Clock In/Out page
            </button>
        }
        return <form onSubmit={(e) => {
                e.preventDefault();
                this.props.onApiKeySelected(this.apiKeyInput.value)
            }}
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

function mapStateToProps(state){
    return {
        loadDataInProgress: selectClockInOutLoadAppDataIsInProgress(state)
    }
}

function mapDispatchToProps(dispatch){
    return {
        onApiKeySelected: function(apiKey){
            dispatch(setApiKey({apiKey}));
            dispatch(clockInOutAppLoadAppData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyDialog)
