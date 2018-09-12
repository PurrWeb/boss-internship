import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import AsyncButton from 'react-async-button';
import _ from 'lodash';

import modalDecorator from './modal-decorator';

class WarningModal extends React.Component {
  render() {
    const {
      show,
      title,
      text,
      buttonText,
      onClose,
      onSubmit,
      props,
      buttonClassName,
    } = this.props;

    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content boss-modal-window boss-modal-window_role_danger`,
          afterOpen: 'ReactModal__Content--after-open',
        }}
      >
        <button onClick={onClose} className="boss-modal-window__close" />
        <div className="boss-modal-window__header">{title}</div>
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
            <AsyncButton
              className={buttonClassName}
              text={buttonText}
              onClick={() => onSubmit(props)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

function openWarningModal(
  { title = 'Warning modal', text = 'Are you sure ?', buttonText = 'Confirm', buttonClassName = 'boss-button boss-button_role_cancel' },
  props = {},
  onSubmit,
  onClose,
  wrapper,
) {
  ReactDOM.render(
    <WarningModal
      show={true}
      title={title || 'Warning modal'}
      text={text || 'Are you sure'}
      buttonText={buttonText || 'Confirm'}
      buttonClassName={buttonClassName}
      onClose={onClose}
      onSubmit={onSubmit}
      props={props}
    />,
    wrapper,
  );
}

export default modalDecorator(openWarningModal);
