import React from 'react';
import PropTypes from 'prop-types';

class DashboardActions extends React.Component {
  renderChildrens() {
    return React.Children.map(this.props.children, (child, i) => {
      if (child) {
        return React.cloneElement(child, {
          className: `${child.props.className} boss-page-dashboard__button`
        });
      }
    })
  }

  render() {
    return (
      <div className="boss-page-dashboard__buttons-group">
        {this.props.children && this.renderChildrens()}
      </div>
    )
  }
}

DashboardActions.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ])
}

DashboardActions.defaultProps = {
  className: ''
}

export default DashboardActions;
