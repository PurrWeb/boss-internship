import React from 'react';
import PropTypes from 'prop-types';

class BossCheckRow extends React.Component {
  render() {
    return (
      <div className="boss-check__row">
        <div className="boss-check__cell">
          <p className={`${this.props.className}`}>{this.props.title}</p>
          {!!this.props.status && <span className="boss-check__title-status">{this.props.status}</span>}
        </div>
      </div>
    );
  }
}

BossCheckRow.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string,
  className: PropTypes.string,
};

BossCheckRow.defaultProps = {
  className: '',
  status: '',
};

export default BossCheckRow;
