import React from "react"
import { connect } from "react-redux"
import {completeConfirmationModal, cancelConfirmationModal} from "~redux/actions"

class ConfirmationModal extends React.Component {
    render(){
        if (!this.props.isVisible) {
            return null;
        }
        return <div>
            CONFIRMATION MODAL!!
            <a className="btn btn-default" onClick={() => this.complete()}>
                OK
            </a>
            <a className="btn btn-default" onClick={() => this.cancel()}>
                Cancel
            </a>
        </div>
    }
    complete(){
        this.props.completeConfirmationModal({});
    }
    cancel(){
        this.props.cancelConfirmationModal();
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
        },
        cancelConfirmationModal: function(){
            dispatch(cancelConfirmationModal());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal)