import React from 'react';
import classnames from 'classnames';
import Answer from './answer';
import FileReaderInput from 'react-file-reader-input';
import FileUploadService from '../services/file-upload';
import ImagesPicker from '~/components/images-picker';

import uuid from 'uuid/v1'

export default class FileUpload extends React.Component {
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

    this.props.setUpload({
      questionnaireQuestionId: this.props.currentQuestion.id,
      url: upload.url,
      id: upload.id
    });
  }

  hasFilePreviouslyUploaded(file) {
    if (!file.id) return false;

    let uploadedFiles = this.state.uploadedFiles;
    let uploadedFilesArray = uploadedFiles.map(function(uploadedFile) {
      return [uploadedFile.name, uploadedFile.lastModified, uploadedFile.size];
    });
    let fileArray = [file.name, file.lastModified, file.size];

    return !!uploadedFilesArray.find(function(f) {  return _.isEqual(f, fileArray) } );
  }

  handleChange = (files) => {
    let count = 0;
    let uploadedFiles = this.state.uploadedFiles;

    for (count; count < files.length; count++) {
      let currentFile = files[count];

      if (!this.hasFilePreviouslyUploaded(currentFile)) {
        FileUploadService.perform(currentFile).then(response => {
          uploadedFiles.push(currentFile)

          this.setState({
            uploadedFiles: uploadedFiles
          });

          this.saveImageToAnswer(response);
        }).catch(error => {
          this.props.setUpload({
            uuid: uuid(),
            file: error.file,
            error: error.responseJSON.file,
            questionnaireQuestionId: this.props.currentQuestion.id
          });
        });
      }
    }
  }

  openPicker = () => {
    this.imagesPicker.open();
  }

  render() {
    return (
      <span className="boss-question__file-label" onClick={this.openPicker}>
        <ImagesPicker
          multiple={true}
          onPicked={this.handleChange}
          ref={ref => (this.imagesPicker = ref)}
        />
        <span className="boss-question__file-label-text">Add image</span>
      </span>
    )
  }
}
