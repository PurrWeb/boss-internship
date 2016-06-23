import React from "react"
import { connect } from "react-redux"
import actionCreators from "~redux/actions"
import { selectClockInOutLoadAppDataIsInProgress } from "~redux/selectors"
import KeyDialog from "../components/key-dialog"

class LoadAppDataDialog extends React.Component {
    render(){
        return <KeyDialog {...this.props} />
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
            dispatch(actionCreators.setApiKeyAndFetchClockInOutAppData(apiKey))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadAppDataDialog)
