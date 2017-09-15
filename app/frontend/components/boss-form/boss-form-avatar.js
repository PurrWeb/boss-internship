import React from 'react';
import Cropper from 'react-cropper';
import DropZone from 'react-dropzone';

const VALID_FILE_TYPES = 'image/jpeg, image/jpg, image/png, image/gif';
const MAX_FILE_SIZE = 10000000;

class BossFormAvatar extends React.PureComponent {
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
    }
  }

  openFileDialog = (e) => {
    this.dropZone.open();
  }

  onRotateLeft = () => {
    this.cropper.rotate(-90);
  }

  onRotateRight = () => {
    this.cropper.rotate(90);
  }

  onCropSubmit = () => {
    const croppedImageUrl = this.cropper.getCroppedCanvas().toDataURL();
    this.setState({
      avatarUrl: croppedImageUrl,
      showCropper: false,
      croppAvatarUrl: null,
    }, () => {
      this.onChange(croppedImageUrl);
    });
  }

  onCancelCrop = () => {
    this.setState({
      showCropper: false,
      croppAvatarUrl: null,
    });
  }

  onRestoreOriginalUrl = () => {
    this.setState({
      avatarUrl: this.state.originalAvatarUrl,
      touched: false,
    }, () => {
      this.onChange(this.state.avatarUrl);
    });
  }

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
                ref={(cropper) => { this.cropper = cropper; }}
                src={this.state.croppAvatarUrl}
                preview="[data-avatarPreview]"
                style={{
                height: '100%',
                width: '100%'
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

  onAddNewAvatar = (files) => {
    if (!files && !!files.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      let dataUrl = reader.result;
      let image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        let canvas = document.createElement('canvas');
        
        let iw = image.width;
        let ih = image.height;
        
        let scale = Math.min((1024 / iw), (768 / ih));
        
        let iwScaled = iw * scale;
        let ihScaled = ih * scale;
        
        canvas.width = iwScaled;
        canvas.height = ihScaled;

        let ctx = canvas.getContext('2d');
        
        if (ctx === null) {
          return;
        }

        ctx.drawImage(image, 0, 0, iwScaled, ihScaled);

        dataUrl = canvas.toDataURL('image/jpeg');
        this.setState({
          showCropper: true,
          touched: true,
          croppAvatarUrl: dataUrl || ''
        });
      };

    });

    reader.readAsDataURL(file);
  }

  renderRestoreOriginalButton() {
    return this.state.touched
      ? <button
          type="button"
          className="boss-button boss-buttons-group_adjust_button"
          onClick={this.onRestoreOriginalUrl}
        >
          Restore original
        </button>
      : null;
  }

  render() {
    const {
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div className="boss-form__field">
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
        { this.state.showCropper
          ? this.renderCropperBlock()
          : <div className="boss-add-avatar-block">
              <div className="boss-add-avatar-block__preview">
                <img src={this.state.avatarUrl} alt="Avatar" className="boss-add-avatar-block__preview-image"/>
              </div>
              <DropZone
                ref={(node) => { this.dropZone = node; }}
                accept={VALID_FILE_TYPES}
                onDrop={this.onAddNewAvatar}
                style={{display: 'none'}}
              />
              <div className="boss-buttons-group boss-edit-image-block_adjust_buttons-group">
                <button
                  type="button"
                  className="boss-button boss-button_role_file boss-buttons-group_adjust_button"
                  onClick={this.openFileDialog}
                >
                  Choose File
                </button>
                { this.renderRestoreOriginalButton() }
              </div>
              <span className="boss-add-avatar-block__file-label">
                Drag and drop file here or click choose file to upload new photo
              </span>
            </div>
          }
      </div>
    )
  }
}

export default BossFormAvatar;
