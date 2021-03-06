import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StaffDashboard from './staff-dashboard';
import StaffDashboardTitle from './staff-dashboard-title';
import ContentWrapper from '~/components/content-wrapper';
import PageContent from './page-content';
import StaffMemberFilter from './staff-member-filter';

class Page extends Component {
  render() {
    const {
      count,
      title,
      venues,
      staffMembers,
      staffTypes,
      dashboardFilterRenderer,
      filter,
      repeatOffenders,
    } = this.props;
    document.title = this.props.title;
    if (staffMembers.size === 0) {
      return (
        <main className="boss-page-main">
          <StaffDashboard
            title={() => <StaffDashboardTitle text={title} count={count} />}
            filterRenderer={dashboardFilterRenderer}
          />
          {count === 0 && (
            <ContentWrapper>
              <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting">
                <div className="boss-users">
                  <p className="boss-users__text-placeholder">No staff members found</p>
                </div>
              </div>
            </ContentWrapper>
          )}
        </main>
      );
    }
    return (
      <main className="boss-page-main">
        <StaffDashboard
          title={() => <StaffDashboardTitle text={title} count={count} />}
          filterRenderer={dashboardFilterRenderer}
        />
        <ContentWrapper>
          <PageContent
            total={count}
            tabsFilterRenderer={this.props.tabsFilterRenderer}
            staffMembers={staffMembers}
            venues={venues}
            repeatOffenders={repeatOffenders}
            simpleLayout={this.props.simpleLayout}
            selectedVenueIds={this.props.selectedVenueIds}
            staffTypes={staffTypes}
            staffMemberFilterRenderer={filter ? props => <StaffMemberFilter {...props} /> : null}
            staffMemberListRenderer={this.props.staffMemberListRenderer}
            contentRenderer={this.props.contentRenderer}
          />
        </ContentWrapper>
      </main>
    );
  }
}

Page.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
  staffMemberListRenderer: PropTypes.func,
  contentRenderer: PropTypes.func,
  simpleLayout: PropTypes.bool,
};

export default Page;
