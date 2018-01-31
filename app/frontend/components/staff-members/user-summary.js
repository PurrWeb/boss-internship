import React from 'react';
import PropTypes from 'prop-types';

class UserSummary extends React.Component {
  render() {
    return (
      <div className={`boss-user-summary ${this.props.className}`}>
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={this.props.src} alt={this.props.alt} className="boss-user-summary__pic"/>
            </div>
          </div>
        </div>
        <div className="boss-user-summary__content boss-user-summary__content_adjust_middle">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">{this.props.fullName}</h2>
          </div>
        </div>
      </div>
    )
  }
}

UserSummary.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
}

UserSummary.defaultProps = {
  className: '',
}

export default UserSummary;
