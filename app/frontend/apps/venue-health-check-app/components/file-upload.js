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
    this.props.setAnswer({
      questionnaireQuestionId: this.props.currentQuestion.id,
      image_ids: [],
      image_uploads: []
    });

    return this.props.answers.find(answer => {
      return answer.questionnaireQuestionId == this.props.currentQuestion.id;
    });
  }

  saveImageToAnswer(upload) {
    let uploads = this.props.uploads;
    let answerUploads = this.props.uploads.filter((upload) => {
      return upload.questionnaireQuestionId == this.props.currentQuestion.id
    });

    this.props.setUpload({
      questionnaireQuestionId: this.props.currentQuestion.id,
      url: upload.url,
      id: upload.id
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

          this.saveImageToAnswer(response);
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
