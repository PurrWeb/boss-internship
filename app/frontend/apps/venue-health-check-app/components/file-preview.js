import React from 'react';
import classnames from 'classnames';

export default class FilePreview extends React.Component {
  static displayName = 'FilePreview';

  renderImages() {
    if (!this.props.currentAnswer) return;

    let uploads = this.props.uploads.filter((upload) => {
      return upload.questionnaireQuestionId == this.props.currentQuestion.id
    });

    console.log(uploads);
    if (!uploads.length) return;

    return uploads.map((upload, index) => {
      return (
        <a href="#" className="boss-question__preview-link" data-modal={ index } key={ upload.id }>
          <img
            src={ upload.url }
            className="boss-question__preview-image"
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
