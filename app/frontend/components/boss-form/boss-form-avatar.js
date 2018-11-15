import React from 'react';
import Cropper from 'react-cropper';

import ImagesPicker, {
  canvasToBlob,
  resizeToLimit,
  getAsDataURL,
} from '~/components/images-picker';

const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 10000000;

class BossFormAvatar extends React.PureComponent {
  static defaultProps = {
    markedRetakeAvatar: false,
    disableUpload: false,
  };

  constructor(props) {
    super(props);
    const {
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
    } = props;

    this.onChange = onChange;

    this.state = {
      originalAvatarUrl: value,
      avatarUrl: value,
      showCropper: false,
      croppAvatarUrl: null,
      touched: false,
    };
  }

  openFileDialog = e => {
    this.imagesPicker.open();
  };

  onRotateLeft = () => {
    this.cropper.rotate(-90);
  };

  onRotateRight = () => {
    this.cropper.rotate(90);
  };

  onCropSubmit = () => {
    canvasToBlob(this.cropper.getCroppedCanvas())
      .then(blob => {
        return resizeToLimit(blob, 1024 * 1024, 600);
      })
      .then(getAsDataURL)
      .then(croppedImageUrl => {
        this.setState(
          {
            avatarUrl: croppedImageUrl,
            showCropper: false,
            croppAvatarUrl: null,
          },
          () => {
            this.onChange(croppedImageUrl);
          },
        );
      });
  };

  onCancelCrop = () => {
    this.setState({
      showCropper: false,
      croppAvatarUrl: null,
    });
  };

  onRestoreOriginalUrl = () => {
    this.setState(
      {
        avatarUrl: this.state.originalAvatarUrl,
        touched: false,
      },
      () => {
        this.onChange(this.state.avatarUrl);
      },
    );
  };

  renderCropperBlock() {
    return (
      <div className="boss-add-avatar-block">
        <div className="boss-edit-image-block boss-add-avatar-block_adjust_edit-image-block">
          <div className="boss-edit-image-block__cropper-block">
            <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
              <button
                type="button"
                className="boss-button boss-buttons-group_adjust_button"
                onClick={this.onRotateLeft}
              >
                Rotate Left
              </button>
              <button
                type="button"
                className="boss-button boss-buttons-group_adjust_button"
                onClick={this.onRotateRight}
              >
                Rotate Right
              </button>
            </div>

            <div className="boss-edit-image-block__cropper">
              <Cropper
                ref={cropper => {
                  this.cropper = cropper;
                }}
                src={this.state.croppAvatarUrl}
                preview="[data-avatarPreview]"
                style={{
                  height: '100%',
                  width: '100%',
                }}
                aspectRatio={1}
                guides={true}
              />
            </div>

            <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
              <button
                type="button"
                className="boss-button boss-buttons-group_adjust_button"
                onClick={this.onCropSubmit}
              >
                Ok
              </button>
              <button
                type="button"
                className="boss-button boss-buttons-group_adjust_button"
                onClick={this.onCancelCrop}
              >
                Cancel
              </button>
            </div>
          </div>
          <div
            className="boss-edit-image-block__preview-section"
            alt="preview"
            data-avatarPreview
          />
        </div>
      </div>
    );
  }

  onAddNewAvatar = files => {
    this.setState({
      showCropper: true,
      touched: true,
      croppAvatarUrl: files[0] || '',
    });
  };

  renderRestoreOriginalButton() {
    return this.state.touched ? (
      <button
        type="button"
        className="boss-button boss-buttons-group_adjust_button"
        onClick={this.onRestoreOriginalUrl}
      >
        Restore original
      </button>
    ) : null;
  }

  render() {
    const {
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
      markedRetakeAvatar,
      disableUpload,
    } = this.props;

    return (
      <div className="boss-form__field">
        {touched &&
          error && (
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
          )}
        {this.state.showCropper ? (
          this.renderCropperBlock()
        ) : (
          <div className="boss-add-avatar-block">
            <div className="boss-add-avatar-block__preview" style={{ position: 'relative' }}>
              <img
                src={this.state.avatarUrl}
                alt="Avatar"
                className="boss-add-avatar-block__preview-image"
              />
              {(markedRetakeAvatar && disableUpload) && (
                <div style={{ width: '240px', height: '240px' }} className="boss-user-summary__avatar-overlay">
                  <p
                    style={{ fontSize: '36px' }}
                    className="boss-user-summary__avatar-overlay-text boss-user-summary__avatar-overlay-text_role_retake"
                  >
                    Please retake picture
                  </p>
                </div>
              )}
            </div>
            <ImagesPicker
              ref={ref => {
                this.imagesPicker = ref;
              }}
              accept={VALID_FILE_TYPES}
              asDataURL={true}
              multiple={false}
              onPicked={this.onAddNewAvatar}
              bytesLimit={null}
              maximalResolution={2048}
            />
            <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
              <button
                type="button"
                className="boss-button boss-button_role_file boss-buttons-group_adjust_button"
                onClick={this.openFileDialog}
              >
                Choose File
              </button>
              {this.renderRestoreOriginalButton()}
            </div>
            <span className="boss-add-avatar-block__file-label">
              Drag and drop file here or click choose file to upload new photo
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default BossFormAvatar;
