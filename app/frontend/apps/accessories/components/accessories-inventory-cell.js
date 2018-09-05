import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AccessoriesInventoryCell extends Component {
  renderAction(actionRenderer) {
    if (!actionRenderer) return null;
    return React.cloneElement(actionRenderer());
  }

  render() {
    const { title, count, actionRenderer } = this.props;
    const isNegativeCount = count < 0;
    return (
      <div className="boss-check__cell boss-check__cell_size_third boss-check__cell_delimiter_light">
        <p className="boss-check__text">{title}</p>
        <p className={`boss-check__counter ${isNegativeCount && 'boss-check__counter_state_alert'}`}>{count}</p>
        {this.renderAction(actionRenderer)}
      </div>
    );
  }
}

AccessoriesInventoryCell.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  actionRenderer: PropTypes.func,
};

export default AccessoriesInventoryCell;
