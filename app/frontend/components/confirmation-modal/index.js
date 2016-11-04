import React from "react"
import { connect } from "react-redux"
import {ModalDialog, ModalContainer} from "react-modal-dialog"
import actionCreators from "~redux/actions"
import oFetch from "o-fetch"
import PinInput from "~components/pin-input"

class ConfirmationModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pin: ""
        }
    }
    componentDidUpdate(){
        if (!this.props.isVisible) {
            return;
        }
    }
    render(){
        if (!this.props.isVisible) {
            return null;
        }

        // For now just use an if statement here.
        // I'm not sure how exactly this modal will develop, if
        // at all.
        if (this.props.confirmationType === "PIN") {

            return <ModalContainer onClick={() => this.cancel()}>
                <ModalDialog onClose={() => this.cancel()}>
                    {this.props.modalOptions.title}
                    <div data-test-marker-pin-modal>
                        <form onSubmit={(e) => {e.preventDefault(); this.complete()}}>
                            <PinInput
                                pin={this.state.pin}
                                onChange={pin => this.setState({pin})}
                                />
                            <button
                                type="submit"
                                className="button large expanded"
                                style={{marginTop: 20}}>
                                OK
                            </button>
                        </form>
                    </div>
                </ModalDialog>
            </ModalContainer>;
        } else {
            throw new Error("Modal confirmation type '" + this.props.modalOptions.confirmationType + "' is not supported");
        }
    }
    complete(){
        // Not sure why, but if you hit enter twice quickly it
        // completes twice before hiding the modal
        if (!this.props.isVisible) {
            return;
        }
        this.resetPinInputState();
        this.props.completeConfirmationModal({
            pin: this.state.pin
        });
    }
    cancel(){
        if (!this.props.isVisible) {
            return;
        }
        this.resetPinInputState();
        this.props.cancelConfirmationModal();
    }
    resetPinInputState(){
        this.setState({pin: ""})
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
            dispatch(actionCreators.completeConfirmationModal(confirmationDetails));
        },
        cancelConfirmationModal: function(){
            dispatch(actionCreators.cancelConfirmationModal());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal)
