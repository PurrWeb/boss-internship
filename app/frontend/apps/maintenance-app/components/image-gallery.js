import React from 'react';
import classnames from 'classnames';

export default class ImageGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImage: null,
      deleteText: 'Delete',
    }
  }

  handleImageClick(image, e) {
    e.preventDefault();

    this.setState({ selectedImage: image })
  }

  handleDeleteImage() {
    this.setState({ deleteText: 'Deleting..' });

    this.props.deleteMaintenanceTaskImage(this.state.selectedImage.id).then(() => {
      let index = this.props.selectedMaintenanceTask.maintenanceTaskImages.indexOf(this.state.selectedImage);

      if (index > -1) {
        this.props.selectedMaintenanceTask.maintenanceTaskImages.splice(index, 1);
      }

      this.setState({ selectedImage: null, deleteText: 'Delete' });
    });
  }

  renderImages() {
    return this.props.selectedMaintenanceTask.maintenanceTaskImages.map((image) => {
      return (
        <div className="boss-overview__gallery-item" key={ image.id }>
          <a href="#" className="boss-overview__gallery-link" onClick={ this.handleImageClick.bind(this, image) }>
            <img src={ image.url } className="boss-overview__gallery-image" />
          </a>
        </div>
      );
    });
  }

  renderImagePreview() {
    if (!this.state.selectedImage) {
      return <span></span>;
    }

    return (
      <div className="boss-overview__gallery-full">
        <div className="boss-overview__gallery-close" onClick={ this.handleImageClick.bind(this, null) }>Close</div>
        <img src={ this.state.selectedImage.url } className="boss-overview__gallery-image" />

        <div className="boss-overview__gallery-actions">
          <button className="boss-button boss-button_role_delete boss-button_type_small" onClick={ this.handleDeleteImage.bind(this) }>{ this.state.deleteText }</button>
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.selectedMaintenanceTask.maintenanceTaskImages.length) return <span></span>

    return (
      <div className="boss-overview__group boss-overview__group_adjust_gallery">
        <h4 className="boss-overview__label">
          <span className="boss-overview__label-text">Images</span>
        </h4>

        <div className="boss-overview__gallery">
          { this.renderImagePreview() }

          <div className="boss-overview__gallery-flow">
            { this.renderImages() }
          </div>
        </div>
      </div>
    )
  }
}
