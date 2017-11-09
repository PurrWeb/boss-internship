import React from 'react';
import classnames from 'classnames';

import FileUploadService from '../services/file-upload';
import uuid from 'uuid/v1';

export default class ImageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFiles: this.props.uploadedImages,
      uploadedFileObjects: this.setFileObjects(),
      taskUuid: this.props.taskUuid,
      selectedImage: null,
      deleteText: 'Delete'
    }
  }

  setFileObjects() {
    if (this.props.selectedMaintenanceTask) {
      return this.props.selectedMaintenanceTask.maintenanceTaskImages.map((maintenanceTaskImage) => {
        return {
          uuid: uuid(),
          fileObject: null,
          response: maintenanceTaskImage,
          status: 'successful'
        };
      });
    } else {
      return [];
    }
  }

  hasFilePreviouslyUploaded(file) {
    if (!file.id) return false;

    let uploadedFileObjects = this.props.uploadedImages;
    let uploadedFileObjectsArray = uploadedFileObjects.map(function(uploadedFileObject) {
      return [uploadedFileObject.fileObject.name, uploadedFileObject.fileObject.lastModified, uploadedFileObject.fileObject.size];
    });
    let fileArray = [file.name, file.lastModified, file.size];

    return !!uploadedFileObjectsArray.find(function(f) {  return _.isEqual(f, fileArray) } );
  }

  getTaskId() {
    if (this.props.selectedMaintenanceTask) {
      return this.props.selectedMaintenanceTask.id;
    } else {
      return this.props.taskUuid;
    }
  }

  saveImageToMaintenanceTask(upload) {
    this.props.setMaintenanceTaskImageUpload({
      maintenanceTaskId: this.getTaskId(),
      url: upload.url,
      id: upload.id
    });
  }

  handleChange(e) {
    let count = 0;
    let files = e.target.files;
    let uploadedFileObjects = this.props.uploadedImages;
    let currentFile, tempFile, index, uploadedFileObject, fileObject;

    for (count; count < files.length; count++) {
      currentFile = {
        uuid: uuid(),
        fileObject: files[count],
        response: null,
        status: 'uploading',
        key: Math.random(),
        taskUuid: this.props.taskUuid
      };

      if (!this.hasFilePreviouslyUploaded(currentFile.fileObject)) {
        uploadedFileObjects.push(currentFile);

        this.setState({ uploadedFileObjects: uploadedFileObjects });
        this.props.setUploadedImages(currentFile);

        FileUploadService.perform(currentFile.fileObject, currentFile.uuid).then(response => {
          fileObject = this.getFileObject(response);
          fileObject['response'] = response;
          fileObject['status'] = 'successful';
          fileObject['key'] = Math.random();

          this.setState({
            uploadedFileObjects: uploadedFileObjects
          }, () => {
            if (this.props.selectedMaintenanceTask) {
              this.saveImageToMaintenanceTask(response);
            } else {
              this.props.setUploadedImages(fileObject);
            }

            setTimeout(function() {
              this.setState({ uploadedFiles: this.props.uploadedImages });
            }.bind(this), 500);
          });
        }).catch(error => {
          fileObject = this.getFileObject({ uuid: error.uuid });
          fileObject['status'] = 'failed';
          fileObject['key'] = Math.random();

          this.setState({
            uploadedFileObjects: uploadedFileObjects
          }, () => {
            if (this.props.selectedMaintenanceTask) {
              this.saveImageToMaintenanceTask(response);
            } else {
              this.props.setUploadedImages(fileObject);
            }

            setTimeout(function() {
              this.setState({ uploadedFiles: this.props.uploadedImages });
            }.bind(this), 500);
          });
        });
      }
    }
  }

  getFileObject(response) {
    return this.state.uploadedFileObjects.find(function(uploadedFileObject) {
      return uploadedFileObject.uuid == response.uuid;
    });
  }

  setSelectedImage(uploadedFileObject) {
    this.setState({ selectedImage: uploadedFileObject });
  }

  renderImages() {
    return this.state.uploadedFiles.map((uploadedFileObject) => {
      if (uploadedFileObject.response) {
        return (
          <div className="boss-upload__preview boss-upload__preview_adjust_flow" key={ uploadedFileObject.key } >
            <a className="boss-upload__preview-link" onClick={ this.setSelectedImage.bind(this, uploadedFileObject) }>
              <img src={ uploadedFileObject.response.url } alt="Preview 1" className="boss__upload__preview-image"  />
            </a>
          </div>
        );
      } else {
        if (uploadedFileObject.status === 'failed') {
          return (
            <div className="boss-upload__preview boss-upload__preview_adjust_flow boss-upload__preview_state_broken" key={uploadedFileObject.key}>
              <a className="boss-upload__preview-link" onClick={ this.setSelectedImage.bind(this, uploadedFileObject) }></a>
            </div>
          );
        } else {
          return <div className="boss-upload__preview boss-upload__preview_adjust_flow boss-upload__preview_state_loading" key={uploadedFileObject.key} onClick={ this.setSelectedImage.bind(this, uploadedFileObject) }></div>;
        }
      }

    });
  }

  removeSelectedImage() {
    this.setState({ selectedImage: null, deleteText: 'Delete' });
  }

  deleteImage(selectedImage, e) {
    e.preventDefault();

    this.setState({ deleteText: 'Deleting..' });

    this.props.deleteImage(selectedImage);

    setTimeout(function() {
      this.removeSelectedImage();
      this.setState({ uploadedFiles: this.props.uploadedImages });
    }.bind(this), 500);
  }

  renderSelectedImageHtml() {
    let status = this.state.selectedImage.status;

    if (status == 'successful') {
      return <img src={ this.state.selectedImage.response.url } alt="Full image 3" className="boss-upload__full-image" />;
    } else {
      return <div className="boss-upload__preview boss-upload__preview_adjust_flow boss-upload__preview_state_broken boss-upload__full-image"></div>;
    }
  }

  renderSelectedImage() {
    if (!this.state.selectedImage) return;

    return (
      <div className="boss-upload__full">
        <div className="boss-upload__full-close" onClick={ this.removeSelectedImage.bind(this) }>
          Close
        </div>

        { this.renderSelectedImageHtml() }

        <div className="boss-upload__full-actions">
          <button className="boss-button boss-button_role_delete boss-button_type_small" onClick={ this.deleteImage.bind(this, this.state.selectedImage) }>{ this.state.deleteText }</button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="boss-form__row boss-form__row_position_last">
        <div className="boss-form__field boss-form__field_role_label-extra-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">Images</span>
          </p>
        </div>

        <div className="boss-form__field boss-form__field_layout_max">
          <div className="boss-upload">
            { this.renderSelectedImage() }

            <div className="boss-upload__flow">
              { this.renderImages() }

              <div className="boss-upload__field boss-upload__field_adjust_flow">
                <input name="files[]" type="file" multiple={ true } className="boss-upload__field-input" onChange={ this.handleChange.bind(this) }/>
                <p className="boss-upload__field-label">Add Images</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
