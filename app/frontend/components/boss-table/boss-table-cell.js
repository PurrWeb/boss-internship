import React from 'react';
import PropTypes from 'prop-types';

class BossTableCell extends React.Component {
  render() {
    return (
      <div className={`boss-table__cell ${this.props.className}`}>
        <div className="boss-table__info">
          { this.props.children }
        </div>
      </div>
    )
  }
}

BossTableCell.propTypes = {
  className: PropTypes.string,
}

BossTableCell.defaultProps = {
  className: '',
}

export default BossTableCell;
