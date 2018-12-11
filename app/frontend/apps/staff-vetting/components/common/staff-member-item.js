import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class StaffMemberItem extends Component {
  renderContent = staffMember => {
    const content = oFetch(this.props, 'content');
    return React.cloneElement(content(staffMember));
  };

  render() {
    const staffMember = oFetch(this.props, 'staffMember');
    const avatarUrl = oFetch(staffMember, 'avatarUrl');

    return (
      <div className="boss-users__flow-item">
        <div className="boss-user-summary boss-user-summary_role_review-short">
          <div className="boss-user-summary__side">
            <div className="boss-user-summary__avatar">
              <div className="boss-user-summary__avatar-inner">
                <img src={avatarUrl} />
              </div>
            </div>
          </div>
          {this.renderContent(staffMember)}
        </div>
      </div>
    );
  }
}
