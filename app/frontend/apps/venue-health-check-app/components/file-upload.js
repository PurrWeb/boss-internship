import React from 'react';
import classnames from 'classnames';

import Answer from './answer';
import FileUploadService from '../services/file-upload';

export default class FileUpload extends React.Component {
  static displayName = 'FileUpload';

  constructor(props) {
    super(props);

    this.state = {
      uploadedFiles: []
    }
  }

  setAnswer() {
    let answerParams = {
      questionnaireQuestionId: this.props.currentQuestion.id,
      image_ids: []
    };

    this.props.setAnswer(answerParams);
  }

  saveImageToAnswer(imageId) {
    let answer = this.props.currentAnswer || this.setAnswer;
    let imageIds = [];

    if (answer.image_ids) {
      imageIds = answer.image_ids;
    }

    imageIds.push(imageId)

    this.props.setAnswer({
      questionnaireQuestionId: this.props.currentQuestion.id,
      image_ids: imageIds
    })
  }

  hasFilePreviouslyUploaded(file) {
    let uploadedFiles = this.state.uploadedFiles;
    let uploadedFilesArray = uploadedFiles.map(function(uploadedFile) {
      return [uploadedFile.name, uploadedFile.lastModified, uploadedFile.size];
    });
    let fileArray = [file.name, file.lastModified, file.size];

    return !!uploadedFilesArray.find(function(f) {  return _.isEqual(f, fileArray) } );
  }

  handleChange(e) {
    let count = 0;
    let files = e.target.files;
    let uploadedFiles = this.state.uploadedFiles;

    for (count; count < files.length; count++) {
      if (!this.hasFilePreviouslyUploaded(files[count])) {
        FileUploadService.perform(files[count]).then(response => {
          uploadedFiles.push(files[count - 1])

          this.setState({
            uploadedFiles: uploadedFiles
          });

          this.saveImageToAnswer(response.id);
        });
      }
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
