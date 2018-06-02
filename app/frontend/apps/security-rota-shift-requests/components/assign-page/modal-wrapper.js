import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

export default function ModalWrapper({ show, children, onClose }) {
  return (
    <Modal
      isOpen={show}
      shouldCloseOnOverlayClick={true}
      contentLabel="Modal"
      className={{
        base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_rota`,
      }}
    >
      <button
        onClick={onClose}
        className="boss-modal-window__close boss-modal-window__close_primary"
      />
      <div className="boss-modal-window__content">{children}</div>
    </Modal>
  );
}
