import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';

import { openContentModal, MODAL_TYPE2, MODAL_TYPE1 } from '~/components/modals';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import { getTimeDodgersRequest, markRepeatOffenderRequest } from '../requests';
import * as selectors from '../selectors';
import StaffDashboard from '../components/staff-dashboard';
import { OffenderInfo, VenueSelectFilter } from '../components/offenders';
import { Tabs, TimeDodgerInfo } from '../components/time-dodgers';
import {
  TextFilter,
  StaffMembersListWrapper,
  StaffMembersList,
  StaffMemberItem,
  DashboardFilter,
} from '../components/common';
import MarkHandled from '../components/mark-handled';

const getEndDate = uiDate =>
  safeMoment
    .uiDateParse(uiDate)
    .endOf('isoWeek')
    .format(utils.commonDateFormat);

class TimeDodgers extends Component {
  constructor(props) {
    super(props);

    const currentDate = this.getCurrentDateFromQuery();
    const weekStartDate = safeMoment
      .uiDateParse(currentDate)
      .startOf('isoWeek')
      .format(utils.commonDateFormat);

    const weekEndDate = safeMoment
      .uiDateParse(currentDate)
      .endOf('isoWeek')
      .format(utils.commonDateFormat);

    this.state = {
      fetching: true,
      selectedVenueIds: this.getSelectedVenueIdsFromURL(),
      filterValue: this.getFilterFromQuery(),
      startDate: weekStartDate,
      endDate: weekEndDate,
      currentDate: currentDate,
      offendersCount: null,
      markNeededOffendersCount: null,
      hardDodgers: [],
      softDodgers: [],
      selectedTab: this.getTabFromQuery(),
    };
  }

  getCurrentDateFromQuery = () => {
    const { currentDate } = this.props.match.params;
    if (!currentDate) {
      return moment()
        .subtract(1, 'week')
        .startOf('isoWeek')
        .format(utils.commonDateFormat);
    }
    return currentDate;
  };

  getTabFromQuery = () => {
    const tabFromQuery = queryString.parse(this.props.location.search).tab;
    if (!tabFromQuery) {
      return 'hard';
    }
    return queryString.parse(this.props.location.search).tab;
  };

  getFilterFromQuery = () => {
    return queryString.parse(this.props.location.search).filter || '';
  };

  applyDodgerData = (dodger, staffMembers) => {
    const staffMemberId = oFetch(dodger, 'staffMemberId');
    const staffTypes = oFetch(this.props, 'staffTypes').toJS();
    const venues = oFetch(this.props, 'venues').toJS();
    const staffMember = staffMembers.find(staffMember => oFetch(staffMember, 'id') === staffMemberId);
    const staffTypeId = oFetch(staffMember, 'staffTypeId');
    const venueId = oFetch(staffMember, 'venueId');
    const staffType = staffTypes.find(staffType => oFetch(staffType, 'id') === staffTypeId);
    const venue = venues.find(venue => oFetch(venue, 'id') === venueId);
    if (!staffMember) {
      throw new Error('Staff member must be present');
    }
    return {
      ...staffMember,
      fullName: `${staffMember.firstName} ${staffMember.surname}`,
      ...dodger,
      hours: oFetch(dodger, 'minutes'),
      staffType,
      venue: oFetch(venue, 'name'),
    };
  };

  fetchTimeDodgers = async date => {
    const response = await getTimeDodgersRequest(date);
    const [hardDodgers, softDodgers, offendersCount, staffMembers, markNeededOffendersCount] = oFetch(
      response.data,
      'hardDodgers',
      'softDodgers',
      'offendersCount',
      'staffMembers',
      'markNeededOffendersCount',
    );
    const mappedSoftDodgers = softDodgers.map(dodger => {
      return this.applyDodgerData(dodger, staffMembers);
    });
    const mappedHardDodgers = hardDodgers.map(dodger => {
      return this.applyDodgerData(dodger, staffMembers);
    });

    this.setState({
      fetching: false,
      softDodgers: mappedSoftDodgers,
      hardDodgers: mappedHardDodgers,
      offendersCount,
      markNeededOffendersCount,
    });
  };

  componentDidMount = async () => {
    const startDate = oFetch(this.state, 'startDate');
    await this.fetchTimeDodgers(startDate);
  };

  changeURL = (selectedVenueIds, date, tab, filter) => {
    const venuesQueryString = queryString.stringify(
      { venues: selectedVenueIds, tab, filter: filter === '' ? undefined : filter },
      { arrayFormat: 'bracket' },
    );
    this.props.history.replace({
      pathname: `/time_dodges/${date}`,
      search: `?${venuesQueryString}`,
    });
  };

  getSelectedVenueIdsFromURL = () => {
    const selectedVenueIdsArray = queryString.parse(this.props.location.search, { arrayFormat: 'bracket' }).venues;
    return selectedVenueIdsArray ? selectedVenueIdsArray.map(id => Number(id)) : [];
  };

  filterByVenues = (staffMembers, selectedVenueIds) => {
    if (!selectedVenueIds) {
      return staffMembers;
    }
    if (selectedVenueIds.length === 0) {
      return staffMembers;
    }
    return staffMembers.filter(staffMember => selectedVenueIds.includes(oFetch(staffMember, 'venueId')));
  };

  handleFilter = value => {
    this.setState({ filterValue: value }, () => {
      const [currentDate, selectedTab, selectedVenueIds, filterValue] = oFetch(
        this.state,
        'currentDate',
        'selectedTab',
        'selectedVenueIds',
        'filterValue',
      );
      this.changeURL(selectedVenueIds, currentDate, selectedTab, filterValue);
    });
  };

  handleVenueFilterChange = venuesIds => {
    this.setState({
      selectedVenueIds: venuesIds,
    });
    const [currentDate, selectedTab, filterValue] = oFetch(this.state, 'currentDate', 'selectedTab', 'filterValue');
    this.changeURL(venuesIds, currentDate, selectedTab, filterValue);
  };

  handleTabClick = tabName => {
    this.setState({ selectedTab: tabName }, () => {
      const [currentDate, selectedTab, selectedVenueIds, filterValue] = oFetch(
        this.state,
        'currentDate',
        'selectedTab',
        'selectedVenueIds',
        'filterValue',
      );
      this.changeURL(selectedVenueIds, currentDate, selectedTab, filterValue);
    });
  };

  getCurrentDodgersList = () => {
    const [selectedTab, selectedVenueIds, filterValue, softDodgers, hardDodgers] = oFetch(
      this.state,
      'selectedTab',
      'selectedVenueIds',
      'filterValue',
      'softDodgers',
      'hardDodgers',
    );
    const dodgersByTab = selectedTab === 'hard' ? hardDodgers : softDodgers;
    return utils.staffMemberFilterFullNameJS(filterValue, this.filterByVenues(dodgersByTab, selectedVenueIds));
  };

  handleDateChange = ({ startDate, endDate }) => {
    const urlStartDate = utils.formatRotaUrlDate(startDate);
    const urlEndDate = utils.formatRotaUrlDate(endDate);
    const [selectedTab, selectedVenueIds, filterValue] = oFetch(
      this.state,
      'selectedTab',
      'selectedVenueIds',
      'filterValue',
    );
    this.changeURL(selectedVenueIds, urlStartDate, selectedTab, filterValue);
    this.setState({
      startDate: urlStartDate,
      endDate: urlEndDate,
      currentDate: urlStartDate,
    });

    this.fetchTimeDodgers(urlStartDate);
  };

  render() {
    const fetching = oFetch(this.state, 'fetching');
    const [title, venues] = oFetch(this.props, 'title', 'venues');

    if (fetching) {
      return null;
    }
    const [
      softDodgers,
      hardDodgers,
      selectedVenueIds,
      startDate,
      endDate,
      filterValue,
      markNeededOffendersCount,
      offendersCount,
      selectedTab,
    ] = oFetch(
      this.state,
      'softDodgers',
      'hardDodgers',
      'selectedVenueIds',
      'startDate',
      'endDate',
      'filterValue',
      'markNeededOffendersCount',
      'offendersCount',
      'selectedTab',
    );
    const softDodgersCount = softDodgers.length;
    const hardDodgersCount = hardDodgers.length;
    const venueTypes = selectors.getVenueTypes(venues);
    const fullCount = softDodgersCount + hardDodgersCount;

    return (
      <div>
        <StaffDashboard
          filterRenderer={() => (
            <VenueSelectFilter
              venueTypes={venueTypes}
              leftSide={() => (
                <DashboardFilter startDate={startDate} endDate={endDate} onDateChange={this.handleDateChange} />
              )}
              selectedVenueIds={selectedVenueIds}
              onChangeVenuesFilter={this.handleVenueFilterChange}
            />
          )}
          title={() => (
            <h1 className="boss-page-dashboard__title">
              <span className="boss-page-dashboard__title-text">{title}</span>
              <span className="boss-page-dashboard__title-info">{fullCount > 0 ? `+${fullCount}` : 0}</span>
            </h1>
          )}
        />
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <Tabs
              softDodgersCount={softDodgersCount}
              hardDodgersCount={hardDodgersCount}
              markNeededOffendersCount={markNeededOffendersCount}
              offendersCount={offendersCount}
              selectedTab={selectedTab}
              onTabClick={this.handleTabClick}
            />
            <TextFilter value={filterValue} onChange={this.handleFilter} />
            <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting boss-page-main__group_context_stack">
              <div className="boss-users">
                <div className="boss-users__flow boss-users__flow_type_no-space">
                  <StaffMembersList
                    items={this.getCurrentDodgersList()}
                    itemRenderer={dodger => {
                      return (
                        <StaffMemberItem
                          staffMember={dodger}
                          content={dodger => {
                            return <TimeDodgerInfo dodger={dodger} startDate={startDate} endDate={endDate} />;
                          }}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TimeDodgers);
