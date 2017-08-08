import React from 'react';
import classnames from 'classnames';

export default class FilePreview extends React.Component {
  static displayName = 'FilePreview';

  openModal(e) {
    e.preventDefault();

    let uploadId = parseInt(e.target.getAttribute('data-upload-id'));

    let image = this.props.uploads.find((upload) => {
      return upload.id == uploadId
    });

    this.props.setModal(true);
    this.props.setModalImage(image)
  }

  openReuploadModal(e) {
    e.preventDefault();

    let uuidUploadId = e.target.getAttribute('data-upload-uuid');

    let image = this.props.uploads.find((upload) => {
      return upload.uuid == uuidUploadId
    });

    this.props.setModal(true);
    this.props.setModalImage(image)
  }

  renderImages() {
    if (!this.props.currentAnswer) return;

    let uploads = this.props.uploads.filter((upload) => {
      return upload.questionnaireQuestionId == this.props.currentQuestion.id
    });

    if (!uploads.length) return;

    return uploads.map((upload, index) => {
      let uploadClass = '';

      if (!upload.id) {
        uploadClass = 'boss-question__preview-link_state_broken';
      }

      if (upload.id) {
        return (
          <a
            href="#"
            className={ `boss-question__preview-link`}
            data-modal={ index }
            key={ upload.id }
            data-upload-id={ upload.id }
            onClick={ this.openModal.bind(this) }
          >
            <img
              src={ upload.url }
              className="boss-question__preview-image"
              data-upload-id={ upload.id }
            />
          </a>
        );
      } else {
        return (
          <a
            href="#"
            className={ `boss-question__preview-link boss-question__preview-link_state_broken`}
            data-modal={ index }
            key={ upload.uuid }
            data-upload-uuid={ upload.uuid }
            onClick={ this.openReuploadModal.bind(this) }
          >
          </a>
        );
      }
    });
  }

  render() {
    return (
      <div className="boss-question__preview">
        { this.renderImages() }
      </div>
    )
  }
}
