import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import modalDecorator from './modal-decorator';

export const MODAL_TYPE1 = 'MODAL_TYPE1';
export const MODAL_TYPE2 = 'MODAL_TYPE2';

const MODAL_TYPE_CLASSNAMES = {
  [MODAL_TYPE1]: 'boss-modal-window_role_edit',
  [MODAL_TYPE2]: 'boss-modal-window_role_confirm',
};

const MODAL_CLOSE_TYPE_CLASSNAMES = {
  [MODAL_TYPE1]: 'boss-modal-window__close-inner',
  [MODAL_TYPE2]: 'boss-modal-window__close',
};

class ContentModal extends React.Component {
  render() {
    const { show, children, title, modalClassName, onClose, type } = this.props;
    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window ${
            MODAL_TYPE_CLASSNAMES[type || MODAL_TYPE1]
          }`,
        }}
      >
        <button onClick={onClose} className={MODAL_CLOSE_TYPE_CLASSNAMES[type]} />
        <div className="boss-modal-window__header">{title}</div>
        <div className="boss-modal-window__content">{children}</div>
      </Modal>
    );
  }
}

function openContentModal(
  { title: title = 'Content Modal', type, modalClassName: modalClassName = 'boss-modal-window_role_edit' },
  props = {},
  onSubmit,
  onClose,
  wrapper,
  closeCallback,
) {
  const whenCloseClicked = () => {
    closeCallback();
    onClose();
  };

  return function(Component) {
    ReactDOM.render(
      <ContentModal show={true} type={type} title={title} onClose={whenCloseClicked} modalClassName={modalClassName}>
        <Component onSubmit={onSubmit} onClose={whenCloseClicked} {...props} />
      </ContentModal>,
      wrapper,
    );
  };
}

export default modalDecorator(openContentModal);
