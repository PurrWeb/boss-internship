import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const BossModal = ({isOpen, children, onCloseClick, className}) => {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Modal"
      className={{
        base: `ReactModal__Content boss-modal-window boss-modal-window_role_details ${className && className}`,
        afterOpen: 'ReactModal__Content--after-open',
      }}
    >
      <button onClick={onCloseClick} className="boss-modal-window__close"></button>
      { children }
    </Modal>
  )
}

export default BossModal;
