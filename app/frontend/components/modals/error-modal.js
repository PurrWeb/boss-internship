import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';

class ContentModal extends Component {
  render() {
    const { show, children, title, onClose } = this.props;

    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_edit`,
        }}
      >
        <button onClick={onClose} className="boss-modal-window__close" />
        <div className="boss-modal-window__header" style={{ backgroundColor: '#ed7f7e', color: '#FFFFFF' }}>
          {title}
        </div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__form">
            {children}
          </div>
        </div>
      </Modal>
    );
  }
}

export default function openErrorModal({ ...params }) {
  require('../../assets/sass/index.sass');
  let url = require('url-loader?limit=1000000!../../../assets/images/something-went-wrong.jpg');

  const { title = 'Something has gone horribly wrong' } = params;

  const bodyFirst = document.body.firstChild;
  const wrapper = document.createElement('div');
  bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);

  const handleClose = () => {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(wrapper);
      wrapper.remove();
    }, 50);
  };

  ReactDOM.render(
    <ContentModal show={true} title={title} onClose={handleClose}>
      <div className="boss-error">
        <img
          src={url}
          alt="Something went wrong"
          className="boss-error__image"
          style={{ maxWidth: '400px', maxHeight: '400px' }}
        />
        <p className="boss-error__text">
          Something unexpected went wrong on the server. This is likely due to an issue with this staff member's data.
          The technical team have been notified of the issue.
        </p>
        <button
          className="boss-button boss-button_role_reload-page boss-error__button"
          onClick={handleClose}
        >
          Continue
        </button>
      </div>
    </ContentModal>,
    wrapper,
  );
}
