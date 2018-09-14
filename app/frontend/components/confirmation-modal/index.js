import React from "react"
import Modal from 'react-modal';
import { connect } from 'react-redux';
import {ModalDialog, ModalContainer} from "react-modal-dialog"
import actionCreators from "~/redux/actions"
import oFetch from "o-fetch"
import PinInput from "~/components/pin-input"

class ConfirmationModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            pin: ""
        }
    }
    componentDidUpdate = () => {
        if (!this.props.isVisible) {
            return;
        }
    }
    onAddNoteSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const textarea = form.querySelector('textarea');
        const noteText = textarea.value;

        this.props.addNote(noteText, this.props.modalOptions.staffMemberObject, this.props.modalOptions.clockInDay);
        this.closeModal();
    }
    render(){
        if (!this.props.isVisible) {
            return null;
        }

        // For now just use an if statement here.
        // I'm not sure how exactly this modal will develop, if
        // at all.
        if (this.props.confirmationType === "PIN") {

            return <Modal
            isOpen={true}
            contentLabel="Modal"
            className={{
              base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_action`,
            }}
          >
            <button onClick={this.cancel} className="boss-modal-window__close" />
            <div className="boss-modal-window__header">
                {this.props.modalOptions.title}
            </div>
                    <div className="boss-modal-window__content" data-test-marker-pin-modal>
                        <form
                            className="boss-modal-window__form"
                            onSubmit={(e) => {e.preventDefault(); this.complete()}}
                        >
                            <PinInput
                                pin={this.state.pin}
                                onChange={pin => this.setState({pin})}
                            />
                            <button
                                type="submit"
                                className="boss-button boss-button_very-big boss-button_role_pin-ok boss-modal-window_adjust_submit-button"
                            >
                                OK
                            </button>
                        </form>
                    </div>
         </Modal>;
        } else if (this.props.confirmationType === "WRONG_PIN") {
            return (

                        <Modal
            isOpen={true}
            contentLabel="Modal"
            className={{
              base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_error`,
            }}
          >
            <button onClick={this.closeModal} className="boss-modal-window__close" />
            <div className="boss-modal-window__header">
                {this.props.modalOptions.title}
            </div>
                        <div className="boss-modal-window__content boss-modal-window__content_role_error" data-test-marker-pin-modal>
                            <div className="boss-modal-window__message-block boss-modal-window__message-block_role_error">
                                <span className="boss-modal-window__message-text">Your Insert Pin Has been Wrong</span>
                                <span className="boss-modal-window__message-text">Please Try Again</span>
                            </div>
                            <button
                                type="button"
                                className="boss-button boss-button_very-big boss-button_role_pin-ok boss-modal-window_adjust_submit-button"
                                onClick={this.props.modalOptions.onRetryClick.bind(this)}
                            >
                                Try Again
                            </button>
                        </div>

                   </Modal>
            );
        } else if (this.props.confirmationType === "ADD_NOTE") {
            return (
                <Modal
            isOpen={true}
            contentLabel="Modal"
            className={{
              base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_warning`,
            }}
          >
            <button onClick={this.closeModal} className="boss-modal-window__close" />

                        <form
                                className="boss-form"
                                onSubmit={this.onAddNoteSubmit}
                                action=""
                        >
                            <div className="boss-modal-window__header boss-modal-window__header_add-note">
                                Add Note for {this.props.modalOptions.firstName} {this.props.modalOptions.surname}
                            </div>

                            <div className="boss-modal-window__content boss-modal-window__content_role_add-note" data-test-marker-pin-modal>
                                <div className="boss-modal-window__message-block boss-modal-window__message-block_role_add-note">
                                    <span className="boss-modal-window__message-text">Add some note for</span>
                                    <span className="boss-modal-window__message-text boss-modal-window__message-text_role_name">
                                    {this.props.modalOptions.firstName} {this.props.modalOptions.surname}
                                </span>
                                </div>
                                <textarea
                                    className="boss-input boss-input_role_in-modal-window boss-input_role_add-note boss-modal-window_adjust_textarea"
                                    placeholder="Type Notes Here..."
                                    rows="6"
                                />
                                <input
                                    type="submit"
                                    className="boss-button boss-button_very-big boss-button_role_pin-ok boss-modal-window_adjust_submit-button"
                                    value="Ok"
                                />
                            </div>
                        </form>

                      </Modal>
            );
        } else {
            throw new Error("Modal confirmation type '" + this.props.modalOptions.confirmationType + "' is not supported");
        }
    }
    complete = () => {
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
    closeModal = () => {
        this.props.cancelConfirmationModal();
    }
    cancel = () => {
        if (!this.props.isVisible) {
            return;
        }
        this.resetPinInputState();
        this.closeModal();
    }
    resetPinInputState = () => {
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
            dispatch(actionCreators().completeConfirmationModal(confirmationDetails));
        },
        cancelConfirmationModal: function(){
            dispatch(actionCreators().cancelConfirmationModal());
        },
        addNote: function(text, staffMemberObject, clockInDay){
            dispatch(actionCreators().addClockInNote({
                text,
                staffMemberObject,
                clockInDay
            }))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal)
