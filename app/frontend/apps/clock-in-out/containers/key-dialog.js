import React from "react"
import { connect } from "react-redux"
import { setClockInOutAppApiKey, clockInOutAppLoadAppData } from "~redux/actions"

class KeyDialog extends React.Component {
    render(){
        return <div>
            <label>Enter key</label><br/>
            <input type="text" ref={(input) => this.apiKeyInput = input}></input>
            <br/><br/>
            <button className="btn btn-default" onClick={() => this.props.onApiKeySelected(this.apiKeyInput.value)}>
                Load Clock In/Out page
            </button>
        </div>
    }
}

function mapStateToProps(){
    return {}
}

function mapDispatchToProps(dispatch){
    return {
        onApiKeySelected: function(apiKey){
            dispatch(setClockInOutAppApiKey({apiKey}));
            dispatch(clockInOutAppLoadAppData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyDialog)
