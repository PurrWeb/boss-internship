import React from 'react';
import classnames from 'classnames';

import Answer from './answer';
import FileUploadService from '../services/file-upload';

export default class FileUpload extends React.Component {
  static displayName = 'FileUpload';

  saveImageToAnswer(imageId) {
    let answer = this.props.currentAnswer;
    let imageIds = [];

    if (answer.image_ids) {
      imageIds = answer.image_ids;
    }

    imageIds.push(imageId)

    this.props.setAnswer({
      questionId: this.props.currentQuestion.id,
      image_ids: imageIds
    })
  }

  handleChange(e, data) {
    var count = 0;
    var files = e.target.files;

    for (count; count <= files.length; count++) {
      FileUploadService.perform(files[count]).then(response => {
        this.saveImageToAnswer(response.id);
      });
    }
  }

  render() {
    return (
      <label className="boss-question__file-label">
        <input name="files[]" type="file" multiple={ true } className="boss-question__file-input" onChange={ this.handleChange.bind(this) }/>
        <span className="boss-question__file-label-text">Add image</span>
      </label>
    )
  }
}
