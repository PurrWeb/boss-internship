import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import Modal from 'react-modal';

const ConfirmationModal = ({
  show,
  confirmations,
  options,
  proceed,
  dismiss,
  cancel,
}) => {
  
  const {
    title,
  } = options;

  const isMessagesInArray = Array.isArray(confirmations);

  const renderMessage = (message, index = 0) => {
    return <span key={index} className="boss-modal-window__message-text">{message}</span>
  }

  return (
    <Modal
      isOpen={show}
      contentLabel="Modal"
      className={{
        base: `ReactModal__Content boss-modal-window boss-modal-window_role_warning`,
        afterOpen: 'ReactModal__Content--after-open',
      }}
    >
    <button onClick={dismiss} className="boss-modal-window__close"></button>
      <div className="boss-modal-window__header">
        {title}
      </div>
      <div className="boss-modal-window__content">
        <div className="boss-modal-window__message-block">
          {isMessagesInArray 
            ? confirmations.map((confirmation, index) => renderMessage(confirmation, index))
            : renderMessage(confirmations)
          }
        </div>
        <div className="boss-modal-window__actions">
          <button
            onClick={dismiss}
            className="boss-button boss-button_role_inactive boss-modal-window__button"
          >Cancel</button>
          <button
            className="boss-button boss-modal-window__button"
            onClick={proceed}
          >Accept</button>
        </div>
      </div>
    </Modal>
  )
}

export default confirmable(ConfirmationModal);
