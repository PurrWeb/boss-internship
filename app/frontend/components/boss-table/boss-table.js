import React from 'react';
import PropTypes from 'prop-types';
import BossTableRow from './boss-table-row';

class BossTable extends React.Component {
  renderChildren() {
    return React.Children.map(this.props.children, (child, i) => {
      return React.cloneElement(child, {
        key: `${i}`,
      });
    });
  }

  render() {
    return (
      <div className={`boss-table ${this.props.className}`}>
        {this.renderChildren()}
      </div>
    );
  }
}

BossTable.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
    .isRequired,
};

BossTable.defaultProps = {
  className: '',
};

export default BossTable;
