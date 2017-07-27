import React from 'react';
import PropTypes from 'prop-types';
import BossModal from '~components/boss-modal';
import { confirmable } from 'react-confirm';
import Modal from 'react-modal';

const WarningModal = ({
  show,
  confirmation,
  options,
  proceed,
  dismiss,
  cancel,
}) => {
  
  const {
    title,
    actionButtonText,
  } = options;

  return (
    <Modal
      isOpen={show}
      contentLabel="Modal"
      className={{
        base: `ReactModal__Content boss-modal-window boss-modal-window_role_danger`,
        afterOpen: 'ReactModal__Content--after-open',
      }}
    >
      <button onClick={dismiss} className="boss-modal-window__close"></button>
      <div className="boss-modal-window__header">
        {title}
      </div>
      <div className="boss-modal-window__content">
        <div className="boss-modal-window__message-block">
          <span className="boss-modal-window__message-text">
            {confirmation}
          </span>
        </div>
        <div className="boss-modal-window__actions">
          <button
            className="boss-button boss-button_role_cancel"
            onClick={proceed}
          >{actionButtonText}</button>
        </div>
      </div>
    </Modal>
  )
}

export default confirmable(WarningModal);
