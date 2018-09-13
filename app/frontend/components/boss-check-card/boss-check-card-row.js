import React from 'react';
import PropTypes from 'prop-types';

class BossCheckCardRow extends React.PureComponent {
  render() {
    return (
      <div className="boss-check__info-row">
        <div className="boss-check__info-cell">
          <p className="boss-check__text">{this.props.title}</p>
        </div>
        <div className="boss-check__info-cell">
          <p className="boss-check__text boss-check__text_role_primary">{this.props.text}</p>
        </div>
      </div>
    );
  }
}

BossCheckCardRow.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

BossCheckCardRow.defaultProps = {
  className: '',
};

export default BossCheckCardRow;
