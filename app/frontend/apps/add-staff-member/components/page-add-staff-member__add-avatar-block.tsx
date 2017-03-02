import * as React from 'react';
import {connect} from 'react-redux';
import Cropper from 'react-cropper';
import SyntheticEvent = React.MouseEvent;

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import avatarAdded from '../../../action-creators/avatar-added';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import limitImageDimensions from '../../../lib/images/limit-image-dimensions_fixed';
import avatarPreviewChanged from '../../../action-creators/avatar-preview-changed';

interface Props {
}

interface MappedProps {
  readonly avatarPreview: string;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly toShowImage: boolean;
  readonly validationMessage: string;
  readonly sourceImage?: string;
}

const VALID_IMAGE_FILE_EXTENSIONS = ['jpeg', 'jpg', 'png'];
const MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING = 700;

class Component extends React.Component<PropsFromConnect, State> {
  state = {
    toShowImage: false,
    validationMessage: '',
    sourceImage: '',
  };

  fileInput: HTMLInputElement;

  onFormComplete = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const action = avatarAdded('');

    this.props.dispatch(action);
  };

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.dispatch(steppingBackRegistration);
  };

  getSupportedFormatsString = () => {
    const lastExtension = VALID_IMAGE_FILE_EXTENSIONS[VALID_IMAGE_FILE_EXTENSIONS.length - 1];
    const extensionsExceptLast = VALID_IMAGE_FILE_EXTENSIONS.filter((extension) => extension !== lastExtension);

    return extensionsExceptLast.join(', ') + ' or ' + lastExtension;
  };

  validateFile(file: File) {
    const extensionMatch = file.name.match(/\.([^.]+)$/);
    const fileExtension = extensionMatch ? extensionMatch[1].toLowerCase() : '';
    const isExtensionValid = VALID_IMAGE_FILE_EXTENSIONS.indexOf(fileExtension) !== -1;
    const validationMessage = isExtensionValid ? '' : `File extension "${fileExtension}"
                is not supported. Use a ${this.getSupportedFormatsString()} file.`;

    this.setState({validationMessage: validationMessage});

    return isExtensionValid;
  }

  onReadFile = (dataUrl: string) => {
    // iOS has a bug where the image gets squashed in the canvas,
    // if it uses too much memory
    limitImageDimensions(
      dataUrl,
      MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING,
      MAXIMUM_IMAGE_SIZE_BEFORE_CROPPING,
      (data?: string) => this.setState({
        sourceImage: data
      }));
  };

  onFileSelected() {
    const files = this.fileInput.files;

    if (!files || files.length === 0) {
      // apparently it is sometimes possible to select 0 files.
      // In that case reset the validation message and do nothing else.
      this.setState({validationMessage: ''});
      return;
    }

    const file = files[0];
    if (!this.validateFile(file)) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      const dataUrl = reader.result;
      this.onReadFile(dataUrl || '');
    });
    reader.readAsDataURL(file);
  }

  renderAddImageInput() {
    return (
      <input
        type="file"
        className="boss3-add-avatar-block__file-loader"
        style={{visibility: 'hidden'}}
        onChange={() => this.onFileSelected()}
        ref={(ref) => {
            this.fileInput = ref;
          }}
      />
    );
  }

  triggerLoadFileClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    this.fileInput.click();
  };

  onRotateLeftClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    (this.refs.cropper as Cropper).rotate(-90);
  };

  onRotateRightClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    (this.refs.cropper as Cropper).rotate(90);
  };

  crop = () => {
    const croppedImageUrl = (this.refs.cropper as Cropper).getCroppedCanvas().toDataURL();
    const action = avatarPreviewChanged(croppedImageUrl);

    this.props.dispatch(action);
  };

  renderCroppedImagePreview() {
    const {avatarPreview} = this.props;

    return avatarPreview ? (
      <img
        width="200"
        height="200"
        src={avatarPreview}
      />
    ) : '';
  }

  renderImageEditorBlock() {
    return (
      <div className="boss3-edit-image-block boss3-add-avatar-block_adjust_edit-image-block">
        <div className="boss3-edit-image-block__cropper-block">
          <div className="boss3-buttons-group boss3-edit-image-block_adjust_buttons-group">
            <a href=""
               className="boss3-button boss3-buttons-group_adjust_button"
               onClick={this.onRotateLeftClick}
            >
              Rotate Left
            </a>
            <a href=""
               className="boss3-button boss3-buttons-group_adjust_button"
               onClick={this.onRotateRightClick}
            >
              Rotate Right
            </a>
          </div>

          <div className="boss3-edit-image-block__cropper">
            <Cropper
              ref="cropper"
              src={this.state.sourceImage}
              style={{
              height: '100%',
              width: '100%'
            }}
              aspectRatio={1}
              guides={true}
              crop={this.crop}
            />
          </div>
        </div>

        <div className="boss3-edit-image-block__preview-section">
          {this.renderCroppedImagePreview()}
        </div>
      </div>
    );
  }

  renderImagePreviewBlock() {
    return this.state.sourceImage ?
      this.renderImageEditorBlock() :
      (
        <div className="boss3-add-avatar-block__new-image-placeholder"
             onClick={this.triggerLoadFileClick}
        />
      );
  }

  render() {
    return (
      <div className="boss3-forms-block">

        <div className="boss3-add-avatar-block">
          {this.renderAddImageInput()}
          {this.renderImagePreviewBlock()}

          <a href=""
             className="boss3-button boss3-button_role_file boss3-add-avatar-block_adjust_file-button"
             onClick={this.triggerLoadFileClick}
          >
            Choose File
          </a>

          <span className="boss3-add-avatar-block__file-label">
            Drag and drop files here or click choose file to upload photo
          </span>
        </div>

        <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
          <a href=""
             className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
             onClick={this.onBackClick}
          >
            Back
          </a>
          <a href=""
             className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button"
             onClick={this.onFormComplete}
          >
            Continue
          </a>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    avatarPreview: state.app.avatarPreview
  };
};

export default connect(
  mapStateToProps
)(Component);
