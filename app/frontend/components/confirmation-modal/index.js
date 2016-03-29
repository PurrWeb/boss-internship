import React from "react"
import { connect } from "react-redux"
import {ModalDialog, ModalContainer} from "react-modal-dialog"
import {completeConfirmationModal, cancelConfirmationModal} from "~redux/actions"

class ConfirmationModal extends React.Component {
    componentDidUpdate(){
        this.refs.pinInput.focus();
    }
    render(){
        if (!this.props.isVisible) {
            return null;
        }

        return <ModalContainer onClick={() => this.cancel()}>
            <ModalDialog onClose={() => this.cancel()}>
                Enter PIN:
                <div className="row">
                    <form onSubmit={(e) => {e.preventDefault(); this.complete()}}>
                        <div className="col-md-9">
                            <input type="text" ref="pinInput"/>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-default">
                                OK
                            </button>
                        </div>
                    </form>
                </div>                
            </ModalDialog>
        </ModalContainer>;
    }
    complete(){
        this.props.completeConfirmationModal({
            pin: this.refs.pinInput.value
        });
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