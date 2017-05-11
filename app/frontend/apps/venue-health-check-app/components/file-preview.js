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

  renderImages() {
    if (!this.props.currentAnswer) return;

    let uploads = this.props.uploads.filter((upload) => {
      return upload.questionnaireQuestionId == this.props.currentQuestion.id
    });

    if (!uploads.length) return;

    return uploads.map((upload, index) => {
      return (
        <a href="#" className="boss-question__preview-link" data-modal={ index } key={ upload.id }>
          <img
            src={ upload.url }
            className="boss-question__preview-image"
            onClick={ this.openModal.bind(this) }
            data-upload-id={ upload.id }
          />
        </a>
      );
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
