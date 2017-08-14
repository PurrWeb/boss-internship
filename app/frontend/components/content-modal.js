import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ContentModal = ({
  show,
  children,
  title,
  onClose,
}) => {
  return (
    <Modal
      isOpen={show}
      contentLabel="Modal"
      className={{
        base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_edit`,
      }}
    >
      <button onClick={onClose} className="boss-modal-window__close-inner"></button>
      <div className="boss-modal-window__header">
        {title}
      </div>
      <div className="boss-modal-window__content">
        {children}
      </div>
    </Modal>
  )
}

export default ContentModal;
