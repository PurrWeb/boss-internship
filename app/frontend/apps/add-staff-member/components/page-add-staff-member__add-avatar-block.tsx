/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import Cropper from 'react-cropper';
import * as cx from 'classnames';
import SyntheticEvent = React.MouseEvent;
import {Control, Form, Errors, ModelAction, actions} from 'react-redux-form';
import {curry} from 'ramda';
import 'cropperjs/dist/cropper.css';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, UploadPhotoFormFields} from '../../../interfaces/store-models';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import avatarPreviewChanged from '../../../action-creators/avatar-preview-changed';
import {OfType, AnyDict} from '../../../interfaces/index';
import avatarBlockValidated from '../../../action-creators/avatar-block-validated';
import {AvatarInputValidators} from '../../../interfaces/forms';
import {isRequiredField, isWrongFileExtension, fileSizeIsTooBig} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import addingSourceImage from '../../../action-creators/adding-source-image';
import ImageLoader from './image-loader';
import {UploadPhotoForm} from '../../../reducers/forms';
import {hasFormUnfilledRequiredFields, hasFormValidationErrors} from '../../../helpers/validators';
import changingStepInfo from '../../../action-creators/changing-step-info';

import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import changeStep from '../../../action-creators/current-step-changed';

import { resizeToLimit, resizeToResolution, getAsDataURL, canvasToBlob } from '../../../components/images-picker';

interface Props {
}

interface MappedProps {
  readonly avatarPreview: string;
  readonly sourceImage: string;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly toShowCropper: boolean;
  readonly avatarPreviewSrc: string;
  readonly avatarSrc: string;
  readonly validationMessage: string;
}


const VALID_FILE_TYPES = 'image/jpeg, image/jpg, image/png, image/gif';
const MAX_FILE_SIZE = 10000000;

class Component extends React.Component<PropsFromConnect, State> {
  dropZone: ImageLoader;
  cropper: Cropper;

  constructor(props: PropsFromConnect) {
    super(props);
    this.state = {
      toShowCropper: false,
      avatarPreviewSrc: '',
      avatarSrc: props.sourceImage,
      validationMessage: '',
    };
  }

  changeAction = (model: string, value: any) => {
    this.props.dispatch(actions.change(model, value[0]));
    this.props.dispatch(actions.setTouched(model));
  }

  handleFormSubmit = () => {
    const cropper = this.cropper;
    // const croppedImageUrl = cropper ? cropper.getCroppedCanvas().toDataURL() : '';
    // const formModelData: OfType<UploadPhotoFormFields, string> = {
    //   avatar: croppedImageUrl
    // };
    this.props.dispatch(changeStep('formsData.basicInformationForm', ADD_STAFF_MEMBER_STEPS.AddAvatarBlock + 1));
  };

  handleFormUpdate = (formModelData: UploadPhotoForm) => {
    const visited = true;
    const hasUnfilledRequiredFields = hasFormUnfilledRequiredFields<UploadPhotoForm>(formModelData);
    const hasValidationErrors = hasFormValidationErrors<UploadPhotoForm>(formModelData);
    const action = changingStepInfo('AddAvatarBlock', visited, hasUnfilledRequiredFields, hasValidationErrors);

    this.props.dispatch(action);
  };

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(changeStep('formsData.basicInformationForm', ADD_STAFF_MEMBER_STEPS.AddAvatarBlock - 1));
  };

  triggerLoadFileClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    this.dropZone.open();
  };

  onRotateClick = (degrees: number, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    (this.cropper as Cropper).rotate(degrees);
    this.saveImagePreviewToState();
  };

  onRotateLeftClick = curry(this.onRotateClick)(-90);

  onRotateRightClick = curry(this.onRotateClick)(90);
  
  onClearAvatar = () => {
    this.setState({avatarSrc: ''});
    const avatarPreviewChangedAction = avatarPreviewChanged('');
    const sourceImageChangedAction = addingSourceImage('');

    this.props.dispatch(avatarPreviewChangedAction);
    this.props.dispatch(sourceImageChangedAction);
    this.props.dispatch(actions.change('formsData.uploadPhotoForm.avatar', ''));
  };

  onCropSubmit = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.saveImagePreviewToState();
    this.saveImagePreviewToStore();
    this.setState({toShowCropper: false});
  };

  saveImagePreviewToState = () => {
    const croppedImageUrl = this.cropper.getCroppedCanvas().toDataURL();
    this.setState({avatarPreviewSrc: croppedImageUrl});
  };

  saveImagePreviewToStore = () => {
    canvasToBlob(this.cropper.getCroppedCanvas()).then((blob) => {
      return resizeToLimit(blob, 1024 * 1024, 600);
    }).then(getAsDataURL).then(croppedImageUrl => {
      const avatarPreviewChangedAction = avatarPreviewChanged(croppedImageUrl);
      const sourceImageChangedAction = addingSourceImage(this.state.avatarSrc);

      this.props.dispatch(avatarPreviewChangedAction);
      this.props.dispatch(sourceImageChangedAction);
    });
  };

  isAvatarAdded = (file: FileList) => {
    return !!file;
  };

  isProperFormat = (files: FileList) => {
    const file = files[0];

    if (file) {
      return VALID_FILE_TYPES.indexOf(file.type) !== -1;
    } else {
      return true;
    }
  };

  

  isProperFileSize = (files: FileList) => {
    const file = files[0];

    if (file) {
      return file.size <= MAX_FILE_SIZE;
    } else {
      return true;
    }
  };

  renderCropperBlock(toRender: boolean) {
    return toRender ? (
        <div className="boss-edit-image-block__cropper-block">
          <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
            <a href=""
               className="boss-button boss-buttons-group_adjust_button"
               onClick={this.onRotateLeftClick}
            >
              Rotate Left
            </a>
            <a href=""
               className="boss-button boss-buttons-group_adjust_button"
               onClick={this.onRotateRightClick}
            >
              Rotate Right
            </a>
          </div>

          <div className="boss-edit-image-block__cropper">
            <Cropper
              ref={(cropper: any) => { this.cropper = cropper; }}
              src={this.state.avatarSrc}
              preview="[data-avatarPreview]"
              style={{
              height: '100%',
              width: '100%'
            }}
              aspectRatio={1}
              guides={true}
              cropend={this.saveImagePreviewToState}
            />
          </div>

          <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
            <a href=""
               className="boss-button boss-buttons-group_adjust_button"
               onClick={this.onCropSubmit}
            >
              Ok
            </a>
            <a href="javascript:;"
               className="boss-button boss-buttons-group_adjust_button"
               onClick={this.onClearAvatar}
            >
              Clear
            </a>
          </div>

        </div>
      ) : null;
  }

  renderImageEditorBlock() {
    const previewSectionOnEditing = this.state.toShowCropper ? (
        <div
          className="boss-edit-image-block__preview-section"
          alt="preview"
          data-avatarPreview
        />
      ) : null;

    const previewSectionWithoutEditing = !this.state.toShowCropper && this.props.avatarPreview ?
      (
        <div>
          <div
              className="boss-edit-image-block__preview-section"
          >
            <img
              src={this.props.avatarPreview}
              alt="preview"
            />
          </div>
          <a href="javascript:;"
              className="boss-button boss-buttons-group_adjust_button"
              onClick={this.onClearAvatar}
            >
            Clear
          </a>
        </div>
      ) : null;

    return (
      <div className="boss-edit-image-block boss-add-avatar-block_adjust_edit-image-block">
        {this.renderCropperBlock(this.state.toShowCropper)}

        {previewSectionOnEditing}
        {previewSectionWithoutEditing}
      </div>
    );
  }

  renderImagePreviewBlock(toRender: boolean) {
    return toRender ? this.renderImageEditorBlock() : null;
  }

  onDropFiles = (acceptedFiles: FileList, rejectedFiles: FileList) => {
    if (!acceptedFiles || !acceptedFiles.length) {
      return;
    } else {
      // Resize image to 2048px before cropping
      resizeToResolution(acceptedFiles[0], 2048)
      .then(getAsDataURL).then(dataUrl => {
        this.setState({
          toShowCropper: true,
          avatarSrc: dataUrl || ''
        });
      });
    }
  };

  onDropRejected = (files: FileList) => {
    if (!files || !files.length) {
      return;
    } else {
      this.props.dispatch(actions.setValidity('formsData.uploadPhotoForm.avatar', {
        isProperFormat: this.isProperFormat(files),
        isProperFileSize: this.isProperFileSize(files),
      }));
    }
  };

  render() {
    const toShowImageEditingBlock = !!this.state.avatarSrc;
    const imageLoaderClassName = cx('boss-add-avatar-block__new-image-placeholder', {'boss-hidden': toShowImageEditingBlock});

    return (
      <div className="boss-forms-block">
        <Form
          model="formsData.uploadPhotoForm"
          className="boss-form"
          onUpdate={this.handleFormUpdate}
        >
          <label className="boss-label">
            <span className="boss-label__text boss-label__text_type_required">Avatar</span>
          </label>

          <Errors
            model=".avatar"
            messages={{
              isFilled: isRequiredField,
              isProperFormat: isWrongFileExtension,
              isProperFileSize: fileSizeIsTooBig
            }}
            show={(field) => {
              const validity = field.validity as OfType<AvatarInputValidators, boolean>;

              if (!validity.isProperFormat || !validity.isProperFileSize) {
                return true;
              } else {
                return field.touched;
              }
            }}
            wrapper={renderErrorsBlock}
            component={renderErrorComponent}
          />


          <div className="boss-add-avatar-block">

            {this.renderImagePreviewBlock(toShowImageEditingBlock)}
            { !toShowImageEditingBlock && <div className="boss-add-avatar-block">
              <Control
                model=".avatar"
                component={ImageLoader}
                className={imageLoaderClassName}
                changeAction={this.changeAction}
                onChange={this.onDropFiles}
                getRef={(node: any) => { this.dropZone = node; }}
                accept={VALID_FILE_TYPES}
                maxSize={MAX_FILE_SIZE}
                onDropRejected={this.onDropRejected}
                multiple={false}
                mapProps={{
                  onDrop: (data: AnyDict) => {
                    return data.onChange;
                  }
                }}
                validateOn="change"
                validators={{
                  isFilled: this.isAvatarAdded,
                  isProperFormat: this.isProperFormat,
                  isProperFileSize: this.isProperFileSize
                } as AvatarInputValidators}
                errors={{
                  isFilled: (files: FileList) => !this.isAvatarAdded(files)
                }}
                persist={true}
              />

              <a href=""
                 className="boss-button boss-button_role_file boss-add-avatar-block_adjust_file-button"
                 onClick={this.triggerLoadFileClick}
              >
                Choose File
              </a>

              <span className="boss-add-avatar-block__file-label">
                Drag and drop files here or click choose file to upload photo
              </span>
            </div> }
          </div>

          <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
            <input type="button"
               className="boss-button boss-button_role_back boss-buttons-group_adjust_button"
               value="Back"
               onClick={this.onBackClick}
            />
            <input
              type="button"
              className="boss-button boss-button_role_submit boss-buttons-group_adjust_button"
              onClick={this.handleFormSubmit}
              value="Continue"/>
          </div>

        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    avatarPreview: state.app.avatarPreview,
    sourceImage: state.app.sourceImage
  };
};

export default connect(
  mapStateToProps
)(Component);
