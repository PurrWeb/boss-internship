import React from 'react';
import PropTypes from 'prop-types';

class BossCheckSimpleRow extends React.Component {
  render() {
    return <div className="boss-check__row">{this.props.children}</div>;
  }
}

BossCheckSimpleRow.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default BossCheckSimpleRow;
