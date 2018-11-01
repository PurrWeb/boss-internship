import React from 'react';
import PropTypes from 'prop-types';

class BossCheckCardActions extends React.PureComponent {
  renderChildrens() {
    return React.Children.map(this.props.children, (child, i) => {
      if (child) {
        return React.cloneElement(child, {
          className: `${child.props.className} boss-check__button`
        });
      }
    })
  }

  render() {
    return (
      <div className="boss-check__row boss-check__row_role_buttons">
        {this.props.children && this.renderChildrens()}
      </div>
    )
  }
}

BossCheckCardActions.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
  className: PropTypes.string,
}

BossCheckCardActions.defaultProps = {
  className: ''
}

export default BossCheckCardActions;
