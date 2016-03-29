import React from "react"
import { connect } from "react-redux"
import {ModalDialog, ModalContainer} from "react-modal-dialog"
import {completeConfirmationModal, cancelConfirmationModal} from "~redux/actions"
import oFetch from "o-fetch"

class ConfirmationModal extends React.Component {
    componentDidUpdate(){
        if (!this.props.isVisible) {
            return;
        }

        if (this.props.confirmationType === "PIN") {
            this.refs.pinInput.focus();
        }
    }
    render(){
        if (!this.props.isVisible) {
            return null;
        }

        if (this.props.confirmationType === "PIN") {

            return <ModalContainer onClick={() => this.cancel()}>
                <ModalDialog onClose={() => this.cancel()}>
                    {this.props.modalOptions.title}
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
        } else {
            throw new Error("Modal confirmation type '" + this.props.modalOptions.confirmationType + "' is not supported");
        }
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
    var isVisible = state.confirmationModal !== null;
    var modalOptions = {};

    if (isVisible) {
        modalOptions = oFetch(state, "confirmationModal.modalOptions");
    }
    return {
        isVisible,
        modalOptions: modalOptions,
        confirmationType: modalOptions.confirmationType
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