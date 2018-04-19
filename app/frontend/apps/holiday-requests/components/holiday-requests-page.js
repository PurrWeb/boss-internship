import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { SimpleDashboard } from '~/components/boss-dashboards';
import ContentWrapper from '~/components/content-wrapper';
import safeMoment from '~/lib/safe-moment';

import StaffCardList from './staff-card-list';
import StaffCard from './staff-card';
import HolidayRequestList from './holiday-requests-list';
import HolidayRequestsItem from './holiday-requests-item';

class HolidayRequestsPage extends Component {
  handleAcceptClick = (staffMemberId, holidayRequestId) => {
    const actions = oFetch(this.props, 'actions');
    const acceptAction = oFetch(actions, 'acceptHolidayRequest');

    return acceptAction({staffMemberId, holidayRequestId});
  };

  handleRejectClick = (staffMemberId, holidayRequestId) => {
    const actions = oFetch(this.props, 'actions');
    const rejectAction = oFetch(actions, 'rejectHolidayRequest');

    return rejectAction({staffMemberId, holidayRequestId});
  };

  getViewReportUrl(staffMember, holidayRequest) {
    const date = oFetch(holidayRequest, 'startDate');
    const venueId = oFetch(staffMember, 'venueId');

    return `/holidays?date=${date}&venue_id=${venueId}`;
  }

  render() {
    const permissions = oFetch(this.props, 'permissions');
    const holidayRequests = oFetch(this.props, 'holidayRequests');
    const staffMembers = oFetch(this.props, 'staffMembers');

    return (
      <div>
        <SimpleDashboard title="Holiday Requests" />
        <ContentWrapper>
          <StaffCardList
            holidayRequests={holidayRequests}
            staffMembers={staffMembers}
            listObjectName="staffMembers"
            perPage={3}
            itemRenderer={(staffMember, staffMemberHolidayRequests) => (
              <StaffCard staffMember={staffMember}>
                <HolidayRequestList
                  holidayRequests={staffMemberHolidayRequests}
                  itemRenderer={holidayRequest => {
                    return (
                      <HolidayRequestsItem
                        onAcceptClick={() =>
                          this.handleAcceptClick(oFetch(staffMember, 'id'), oFetch(holidayRequest, 'id'))
                        }
                        onRejectClick={() =>
                          this.handleRejectClick(oFetch(staffMember, 'id'), oFetch(holidayRequest, 'id'))
                        }
                        holidayRequest={holidayRequest}
                        viewReportUrl={this.getViewReportUrl(staffMember, holidayRequest)}
                        permissions={permissions}
                      />
                    );
                  }}
                />
              </StaffCard>
            )}
          />
        </ContentWrapper>
      </div>
    );
  }
}

export default HolidayRequestsPage;
