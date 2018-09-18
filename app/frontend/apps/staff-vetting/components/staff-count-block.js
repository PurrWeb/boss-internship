import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

class StaffCountBlock extends Component {
  render() {
    const blockClassName = classNames(
      'boss-count boss-count_role_link boss-count_adjust_row boss-count_size_half boss-count_type_badge',
      {
        'boss-count_state_alert': this.props.count === undefined || (this.props.count && this.props.count > 0),
      },
    );
    return (
      <Link to={this.props.href} className={blockClassName}>
        <div className="boss-count__group">
          {this.props.count !== undefined && <p className="boss-count__number">{this.props.count}</p>}
          <p className="boss-count__label">{this.props.title}</p>
        </div>
      </Link>
    );
  }
}

StaffCountBlock.propTypes = {
  count: PropTypes.number,
  href: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default StaffCountBlock;
