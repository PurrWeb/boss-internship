import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import modalDecorator from './modal-decorator';

class ContentModal extends React.Component {
  render() {
    const { show, children, title, modalClassName, onClose } = this.props;
    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window ${modalClassName}`,
        }}
      >
        <button onClick={onClose} type="button" className="boss-modal-window__close" />
        <div className="boss-modal-window__header">{title}</div>
        <div className="boss-modal-window__content">{children}</div>
      </Modal>
    );
  }
}

function openContentModal(
  { title: title = 'Content Modal', modalClassName: modalClassName = 'boss-modal-window_role_edit' },
  props = {},
  onSubmit,
  onClose,
  wrapper,
) {
  return function(Component) {
    ReactDOM.render(
      <ContentModal show={true} title={title} onClose={onClose} modalClassName={modalClassName}>
        <Component onSubmit={onSubmit} onClose={onClose} {...props} />
      </ContentModal>,
      wrapper,
    );
  };
}

export default modalDecorator(openContentModal);
