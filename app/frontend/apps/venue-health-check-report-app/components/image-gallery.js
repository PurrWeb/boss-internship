import React from 'react';
import classnames from 'classnames';

export default class ImageGallery extends React.Component {
  static displayName = 'ImageGallery';

  renderImages() {
    let uploads = this.props.currentAnswer.uploads;

    return uploads.map(upload => {
      return (
        <div className="boss-popover__image" key={ upload.id }>
          <img
            src={ upload.url }
            onClick={ this.openImageInNewTab.bind(this) }
            style={ { cursor: 'pointer' } }
          />
        </div>
      );
    });
  }

  openImageInNewTab(e) {
    let url = e.target.getAttribute('src');
    let openedWindow = window.open(url, '_blank');

    if (openedWindow) {
      openedWindow.focus();
    } else {
      alert('Please allow popups for this website');
    }
  }

  render() {
    if (!this.props.currentAnswer.uploads.length) {
      return <div></div>;
    }

    return (
      <div className="gallery">
        { this.renderImages() }
      </div>
    )
  }
}
