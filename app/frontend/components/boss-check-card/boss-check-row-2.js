import React from 'react';
import PropTypes from 'prop-types';

class BossCheckRow2 extends React.Component {
  render() {
    return (
      <div className="boss-check__row">
        <div className="boss-check__cell boss-check__cell_size_half">
          <p className={`boss-check__text ${this.props.className1}`}>{this.props.halfOneRenderer()}</p>
        </div>
        <div className="boss-check__cell boss-check__cell_size_half">
          <p className={`boss-check__text ${this.props.className2}`}>{this.props.halfTwoRenderer()}</p>
        </div>
      </div>
    );
  }
}

BossCheckRow2.propTypes = {
  halfOneRenderer: PropTypes.func,
  halfTwoRenderer: PropTypes.func,
  className1: PropTypes.string,
  className2: PropTypes.string,
};

BossCheckRow2.defaultProps = {
  className1: '',
  className2: '',
  halfOneRenderer: () => null,
  halfTwoRenderer: () => null,
};

export default BossCheckRow2;
