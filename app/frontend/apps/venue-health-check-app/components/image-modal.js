import React from 'react';
import classnames from 'classnames';

import { ModalContainer, ModalDialog } from 'react-modal-dialog';

export default class ImageModal extends React.Component {
  static displayName = 'ImageModal';

  cancel() {
    this.props.setModal(false);
    this.props.setModalImage(null);
  }

  deleteUploadFromAnswer() {
    console.log(this.props);
    this.props.deleteUpload(this.props.currentImage);
    this.cancel();
  }

  render() {
    if (!this.props.showModal) return <span></span>;

    return (
      <ModalContainer onClick={() => this.cancel()}>
        <ModalDialog className="boss-modal-window test-window-enter-pin" onClose={() => this.cancel()}>
          <div className="boss-modal-window__content" data-test-marker-pin-modal>
            <div className="boss-modal-window__message-block">
              <img
                src={ this.props.currentImage.url }
                className="boss-modal-window__message-image"
              />
            </div>

            <div className="boss-modal-window__actions">
              <button
                type="button"
                className="boss-button boss-button_role_delete boss-modal-window__button"
                onClick={ this.deleteUploadFromAnswer.bind(this) }
              >
                Delete
              </button>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>
    )
  }
}
