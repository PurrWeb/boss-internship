import React from 'react';
import classnames from 'classnames';

import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import FileUploadService from '../services/file-upload';

export default class ImageModal extends React.Component {
  static displayName = 'ImageModal';

  cancel() {
    this.props.setModal(false);
    this.props.setModalImage(null);
  }

  deleteUploadFromAnswer(e) {
    e.preventDefault();

    this.props.deleteUpload(this.props.currentImage);
    this.cancel();
  }

  reuploadImage(e) {
    e.preventDefault();

    FileUploadService.perform(this.props.currentImage.file).then(response => {
      this.props.deleteUpload(this.props.currentImage);
      this.saveImageToAnswer(response);
      this.cancel();
    }).catch(error => {
      alert('Image couldnt be uploaded, please try again');
      this.cancel();
    });
  }

  saveImageToAnswer(upload) {
    this.props.setUpload({
      questionnaireQuestionId: this.props.currentImage.questionnaireQuestionId,
      url: upload.url,
      id: upload.id
    });
  }

  imageURL() {
    if (this.props.currentImage.id) return this.props.currentImage.url;

    let reader = new FileReader();
    let imageUuid = this.props.currentImage.uuid;

    reader.onload = (e) => {
      $("[data-image-id=" + imageUuid + "]").attr('src', e.target.result);
    }

    reader.readAsDataURL(this.props.currentImage.file);
  }

  renderButton() {
    if (this.props.currentImage.id) {
      return (
        <div className="boss-modal-window__actions">
          <button
            type="button"
            className="boss-button boss-button_role_delete boss-modal-window__button"
            onClick={ this.deleteUploadFromAnswer.bind(this) }
          >
            Delete
          </button>
        </div>
      )
    } else {
      return (
        <div className="boss-modal-window__actions">
          <button
            type="button"
            className="boss-button boss-button_role_reload boss-modal-window__button"
            onClick={ this.reuploadImage.bind(this) }
          >
            Reupload
          </button>
          <button
            type="button"
            className="boss-button boss-button_role_cancel boss-modal-window__button"
            onClick={ this.deleteUploadFromAnswer.bind(this) }
          >
            Remove
          </button>
        </div>
      )
    }
  }

  render() {
    if (!this.props.showModal) return <span></span>;

    return (
      <ModalContainer onClick={() => this.cancel()}>
        <ModalDialog className="boss-modal-window test-window-enter-pin" onClose={() => this.cancel()}>
          <div className="boss-modal-window__content" data-test-marker-pin-modal>
            <div className="boss-modal-window__message-block">
              <img
                src={ this.imageURL() }
                className="boss-modal-window__message-image"
                data-image-id={ this.props.currentImage.id || this.props.currentImage.uuid }
              />
            </div>

            { this.renderButton() }
          </div>
        </ModalDialog>
      </ModalContainer>
    )
  }
}
