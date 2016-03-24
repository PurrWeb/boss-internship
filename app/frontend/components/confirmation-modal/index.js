import React from "react"
import { connect } from "react-redux"
import {completeConfirmationModal} from "~redux/actions"

class ConfirmationModal extends React.Component {
    render(){
        if (!this.props.isVisible) {
            return null;
        }
        return <div onClick={() => this.complete()}>CONFIRMATION MODAL!!</div>
    }
    complete(){
        this.props.completeConfirmationModal({});
    }
}

function mapStateToProps(state){
    return {
        isVisible: state.confirmationModal !== null
    }
}

function mapDispatchToProps(dispatch){
    return {
        completeConfirmationModal: function(confirmationDetails){
            dispatch(completeConfirmationModal(confirmationDetails));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal)