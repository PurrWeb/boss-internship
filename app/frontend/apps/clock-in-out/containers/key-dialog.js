import React from "react"
import { connect } from "react-redux"
import { setClockInOutAppApiKey, clockInOutAppLoadAppData } from "~redux/actions"

class KeyDialog extends React.Component {
    render(){
        return <button onClick={() => this.props.setApiKey("F7AC8662738C9823E7410D1B5E720E4B")}>btn</button>
    }
}

function mapStateToProps(){
    return {}
}

function mapDispatchToProps(dispatch){
    return {
        setApiKey: function(apiKey){
            dispatch(setClockInOutAppApiKey({apiKey}));
            dispatch(clockInOutAppLoadAppData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyDialog)
