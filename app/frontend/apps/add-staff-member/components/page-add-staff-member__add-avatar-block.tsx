/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import Cropper from 'react-cropper';
import SyntheticEvent = React.MouseEvent;
import {Control, Form, Errors, ModelAction} from 'react-redux-form';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, UploadPhotoFormFields} from '../../../interfaces/store-models';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import avatarPreviewChanged from '../../../action-creators/avatar-preview-changed';
import {OfType, AnyDict} from '../../../interfaces/index';
import avatarBlockValidated from '../../../action-creators/avatar-block-validated';
import {AvatarInputValidators} from '../../../interfaces/forms';
import {isRequiredField} from '../../../constants/form-errors';
import {renderErrorsBlock, renderErrorComponent} from '../../../helpers/renderers';
import addingSourceImage from '../../../action-creators/adding-source-image';
import ImageLoader from './image-loader';

interface Props {
}

interface MappedProps {
  readonly avatarPreview: string;
  readonly sourceImage: string;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly toShowImage: boolean;
  readonly validationMessage: string;
}

function changeAction(model: string, value: any): ModelAction {
  return {
    type: 'rrf/change',
    model,
    value: value
  };
}

class Component extends React.Component<PropsFromConnect, State> {
  state = {
    toShowImage: false,
    validationMessage: '',
  };

  dropZone: ImageLoader;

  handleFormSubmit = () => {
    const formModelData: OfType<UploadPhotoFormFields, string> = {
      avatar: this.props.avatarPreview
    };
    const action = avatarBlockValidated(formModelData);

    this.props.dispatch(action);
  };

  onBackClick = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.dispatch(steppingBackRegistration);
  };

  triggerLoadFileClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    this.dropZone.open();
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

  isAvatarAdded = (files: FileList) => {
    const file = files[0];

    return !!file;
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
              src={this.props.sourceImage}
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
    return this.props.sourceImage ?
      this.renderImageEditorBlock() : (
        <Control
          model=".avatar"
          component={ImageLoader}
          className="boss3-add-avatar-block__new-image-placeholder"
          changeAction={changeAction}
          onChange={this.onDropFiles}
          getRef={(node: any) => { this.dropZone = node; }}
          accept="image/jpeg, image/jpg, image/png, image/gif"
          maxSize={1000000}
          mapProps={{
            onDrop: (data: AnyDict) => {
              return data.onChange;
            }
          }}
          validateOn="change"
          validators={{
            isFilled: this.isAvatarAdded
          } as AvatarInputValidators}
          errors={{
            isFilled: (files: FileList) => !this.isAvatarAdded(files)
          }}
          persist={true}
        />
      );
  }

  onDropFiles = (acceptedFiles: FileList, rejectedFiles: FileList) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return;
    } else {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const dataUrl = reader.result;

        this.props.dispatch( addingSourceImage(dataUrl || '') );
      });
      reader.readAsDataURL(file);
    }
  };

  render() {
    return (
      <div className="boss3-forms-block">
        <Form
          model="formsData.uploadPhotoForm"
          className="boss3-form"
          onSubmit={this.handleFormSubmit}
        >
          <label className="boss3-label">
            <span className="boss3-label__text boss3-label__text_type_required">Avatar</span>
          </label>

          <Errors
            model=".avatar"
            messages={{
              isFilled: isRequiredField
            }}
            show={{touched: true}}
            wrapper={renderErrorsBlock}
            component={renderErrorComponent}
          />


          <div className="boss3-add-avatar-block">
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
            <input type="button"
               className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
               value="Back"
               onClick={this.onBackClick}
            />
            <input type="submit" className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button" value="Continue"/>
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
