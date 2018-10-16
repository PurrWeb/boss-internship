import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import AsyncButton from 'react-async-button';
import _ from 'lodash';

import modalDecorator from './modal-decorator';

class WarningModalBig extends React.Component {
  render() {
    const { show, title, text, buttonText, onClose, onSubmit, props, cancel, closeCallback } = this.props;

    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content boss-modal-window boss-modal-window_role_note`,
          afterOpen: 'ReactModal__Content--after-open',
        }}
      >
        <button
          onClick={() => {
            onClose();
            closeCallback();
          }}
          className="boss-modal-window__close"
        />
        <div className="boss-modal-window__header boss-modal-window__header_warning">{title}</div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__message-block">
            {_.isArray(text) ? (
              text.map((message, key) => (
                <span key={key} className="boss-modal-window__message-text">
                  {message}
                </span>
              ))
            ) : (
              <span className="boss-modal-window__message-text">{text}</span>
            )}
          </div>
          <div className="boss-modal-window__actions">
            {cancel && (
              <button
                onClick={() => {
                  onClose();
                  closeCallback();
                }}
                className="boss-button boss-button_role_inactive boss-modal-window__button"
              >
                Cancel
              </button>
            )}
            <AsyncButton
              className="boss-button boss-modal-window__button"
              text={buttonText}
              onClick={() => onSubmit(props)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

function openWarningModalBig(
  { title = 'Warning modal', text = 'Are you sure ?', buttonText = 'Confirm', cancel = false },
  props = {},
  onSubmit,
  onClose,
  wrapper,
  closeCallback = () => {},
) {
  ReactDOM.render(
    <WarningModalBig
      show={true}
      cancel={cancel}
      title={title || 'Warning modal'}
      text={text || 'Are you sure'}
      buttonText={buttonText || 'Confirm'}
      onClose={onClose}
      onSubmit={onSubmit}
      props={props}
      closeCallback={closeCallback}
    />,
    wrapper,
  );
}

export default modalDecorator(openWarningModalBig);
