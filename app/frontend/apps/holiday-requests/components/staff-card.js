import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { appRoutes } from "~/lib/routes";

class StaffCard extends Component {
  render() {
    const staffMember = oFetch(this.props, 'staffMember');
    const staffMemberId = oFetch(staffMember, 'id');
    const avatarUrl = oFetch(staffMember, 'avatarUrl');
    const fullName = oFetch(staffMember, 'fullName');

    return (
      <div className="boss-check boss-check_role_board boss-check_page_accessory-requests">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <div className="boss-check__user-summary">
              <div className="boss-user-summary boss-user-summary_role_card-header-short">
                <div className="boss-user-summary__side">
                  <div className="boss-user-summary__avatar">
                    <div className="boss-user-summary__avatar-inner">
                      <img src={avatarUrl} alt={fullName} />
                    </div>
                  </div>
                </div>
                <div className="boss-user-summary__content">
                  <div className="boss-user-summary__header">
                    <h4 className="boss-user-summary__name">{fullName}</h4>
                  </div>
                  <div className="boss-user-summary__footer">
                    <a
                      href={ appRoutes.staffMemberProfileHolidaysTab({staffMemberId: staffMemberId}) }
                      className="boss-button boss-button_role_view-details-light boss-button_type_extra-small"
                    >
                      View All Holidays
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default StaffCard;
