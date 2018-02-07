import React from 'react';
import PropTypes from 'prop-types';

class DashboardActions extends React.Component {
  renderChildrens() {
    return React.Children.map(this.props.children, (child, i) => {
      return React.cloneElement(child, {
        className: `${child.props.className} boss-page-dashboard__button`
      });
    })
  }

  render() {
    return (
      <div className="boss-page-dashboard__buttons-group">
        {this.renderChildrens()}
      </div>
    )
  }
}

DashboardActions.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.element.isRequired,
  ])
}

DashboardActions.defaultProps = {
  className: ''
}

export default DashboardActions;
