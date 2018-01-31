import React from 'react';
import PropTypes from 'prop-types';
import BossTableCell from './boss-table-cell';

class BossTableRow extends React.Component {
  renderChildren() {
    return React.Children.map(this.props.children, (child, i) => {
      if (child.type === BossTableCell) {
        return React.cloneElement(child, {
          key: `${i}`
        });
      }
      return null;
    });
  }

  render() {
    return (
      <div className={`boss-table__row ${this.props.className}`}>
        { this.renderChildren() }
      </div>
    )
  }
}

BossTableRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
}

BossTableRow.defaultProps = {
  className: '',
}

export default BossTableRow;
