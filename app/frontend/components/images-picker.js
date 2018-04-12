import React from 'react';
import PropTypes from 'prop-types';
import 'blueimp-canvas-to-blob';

const URL = window.URL || window.webkitURL;

export default class ImagesPicker extends React.Component {
  static defaultProps = {
    accept: ['image/*'],
    multiple: false,
    asDataURL: false,
    bytesLimit: 1024 * 1024,
    preferedResolution: 600,
    maximalResolution: null,
  };

  onChange = () => {
    const {
      bytesLimit,
      asDataURL,
      onPicked,
      preferedResolution,
      maximalResolution,
    } = this.props;

    let files = Promise.resolve([].slice.call(this.input.files));

    console.log(files);

    if (bytesLimit) {
      files = files.then(files => {
        const waiting = files.map(file => {
          if (bytesLimit < file.size) {
            return resizeToLimit(file, bytesLimit, preferedResolution);
          }

          return Promise.resolve(file);
        });

        return Promise.all(waiting);
      });
    }

    if (maximalResolution) {
      files = files.then(files => {
        const waiting = files.map(file => {
          return resizeToResolution(file, maximalResolution);
        });

        return Promise.all(waiting);
      });
    }

    if (this.props.asDataURL) {
      files = files.then(files => {
        const waiting = files.map(file => getAsDataURL(file));

        return Promise.all(waiting);
      });
    }

    files.then(files => {
      this.props.onPicked(files);
    });
  };

  open() {
    if (!this.input) return;

    this.input.click();
  }

  render() {
    return (
      <div style={{ display: 'none' }}>
        <input
          type="file"
          multiple={this.props.multiple}
          accept={this.props.accept.join(',')}
          onChange={this.onChange}
          ref={ref => (this.input = ref)}
        />
      </div>
    );
  }
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve =>
    canvas.toBlob(resolve, type || 'image/png', quality),
  );
}

export function getAsDataURL(file) {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onloadend = () => {
      if (reader.error) {
        resolve(null);
      } else {
        resolve(reader.result);
      }
    };

    reader.readAsDataURL(file);
  });
}

export function resizeToLimit(file, limit, resolution) {
  const url = URL.createObjectURL(file);
  const image = new Image();

  return new Promise(resolve => {
    image.onload = () => {
      image.onload = null;
      URL.revokeObjectURL(url);

      tryResizeToLimit({
        image,
        limit: limit,
        resolution: resolution,
        callback: blob => {
          let newFile;
          const fileName = file.name || 'image.jpeg';

          try {
            newFile = new File([blob], fileName, {
              type: 'image/jpeg',
              lastModified: file.lastModified,
            });
          } catch (e) {
            blob.name = fileName;
            blob.type = 'image/jpeg';
            blob.lastModified = file.lastModified;
            newFile = blob;
          }

          resolve(newFile);
        },
      });
    };

    image.src = url;
  });
}

export function resizeToResolution(file, resolution) {
  return resizeToLimit(file, file.size, resolution);
}

export function tryResizeToLimit({ image, resolution, limit, callback }) {
  const canvas = document.createElement('canvas');

  let width;
  let height;

  const { naturalWidth, naturalHeight } = image;

  if (naturalWidth > naturalHeight) {
    if (naturalWidth <= resolution) {
      width = naturalWidth;
      height = naturalHeight;
    } else {
      const scaleDownFactor = naturalWidth / resolution;

      width = resolution;
      height = naturalHeight / scaleDownFactor;
    }
  } else if (naturalHeight > naturalWidth) {
    if (naturalHeight <= resolution) {
      width = naturalWidth;
      height = naturalHeight;
    } else {
      const scaleDownFactor = naturalHeight / resolution;

      width = naturalWidth / scaleDownFactor;
      height = resolution;
    }
  } else {
    if (naturalWidth <= resolution) {
      width = naturalWidth;
      height = naturalHeight;
    } else {
      width = resolution;
      height = resolution;
    }
  }

  canvas.width = width;
  canvas.height = height;
  canvas.webkitBackingStorePixelRatio = 1;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);

  canvas.toBlob(
    blob => {
      if (blob.size > limit) {
        setTimeout(
          () =>
            this.tryResizeToLimit({
              image,
              limit,
              resolution: resolution * 0.9,
              callback: callback,
            }),
          1,
        );

        return;
      }

      callback(blob);
    },
    'image/jpeg',
    1,
  );
}
