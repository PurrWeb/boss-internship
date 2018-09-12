import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import modalDecorator from './modal-decorator';

class ContentModal extends React.Component {
  render() {
    const {
      show,
      children,
      title,
      onClose,
      modalRoleClassName,
      closeButtonOverflowed,
    } = this.props;

    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content ReactModal__Content--after-open boss-modal-window ${modalRoleClassName}`,
        }}
      >
        {closeButtonOverflowed ? (
          <button onClick={onClose} type="button" className="boss-modal-window__close" />
          ) : (
            <button onClick={onClose} className="boss-modal-window__close-inner" />
          )}
        <div className="boss-modal-window__header">
          {title}
        </div>
        <div className="boss-modal-window__content">
          {children}
        </div>
      </Modal>
    )
  }
}

function openContentModal(
  {
    title: title = 'Content Modal',
    modalRoleClassName: modalRoleClassName = 'boss-modal-window_role_edit',
    closeButtonOverflowed: closeButtonOverflowed = false,
  },
  props = {},
  onSubmit,
  onClose,
  wrapper
) {
  return function(Component) {
    ReactDOM.render(
      <ContentModal
        show={true}
        title={title}
        modalRoleClassName={modalRoleClassName}
        closeButtonOverflowed={closeButtonOverflowed}
        onClose={onClose}
      >
        <Component onSubmit={onSubmit} {...props} />
      </ContentModal>,
      wrapper
    );
  }
}

export default modalDecorator(openContentModal)
