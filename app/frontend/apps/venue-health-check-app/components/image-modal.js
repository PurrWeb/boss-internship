import React from 'react';
import classnames from 'classnames';

export default class ImageModal extends React.Component {
  static displayName = 'ImageModal';

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div className="boss-question__preview">
        { this.renderImages() }
      </div>
    )
  }
}
