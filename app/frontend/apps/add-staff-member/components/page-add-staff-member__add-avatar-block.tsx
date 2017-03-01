import * as React from 'react';
import {connect} from 'react-redux';
import Cropper from 'react-cropper';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import avatarAdded from '../../../action-creators/avatar-added';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import limitImageDimensions from '../../../lib/images/limit-image-dimensions_fixed';

interface Props {
}

interface MappedProps {
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
    sourceImage: ''
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

  onAddAvatarClick = () => {
    this.setState({
      toShowImage: true
    });
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

  getStaffImageInput() {
    return (
      <div>
        <input type="file"
            className="form-control"
            onChange={() => this.onFileSelected()}
            ref={(ref) => {
              this.fileInput = ref;
            }}
         />
      </div>
    );
  }

  _crop() {
    // image in dataUrl
    // console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  renderCropper() {
    return this.state.sourceImage ? (
      <Cropper
        ref="cropper"
        src={this.state.sourceImage}
        style={{height: 400, width: 400}}
        aspectRatio={16 / 9}
        guides={false}
        crop={this._crop.bind(this)}
      />
    ) : null;
  }

  render() {
    return (
      <div className="boss3-forms-block">

        {this.renderCropper()}

        {this.getStaffImageInput()}

        <a href=""
           onClick={this.onAddAvatarClick}
        >
          add avatar
        </a>

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
  return {};
};

export default connect(
  mapStateToProps
)(Component);
