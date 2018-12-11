import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';

import { openContentModal, MODAL_TYPE2, MODAL_TYPE1 } from '~/components/modals';
import utils from '~/lib/utils';
import { getRepeatOffendersRequest, markRepeatOffenderRequest } from '../requests';
import * as selectors from '../selectors';
import StaffDashboard from '../components/staff-dashboard';
import {
  OffenderInfo,
  OffenderHistoryModalContent,
  OffenderReviewHistoryModalContent,
  VenueSelectFilter,
} from '../components/offenders';
import { TextFilter, StaffMembersListWrapper, StaffMembersList, StaffMemberItem } from '../components/common';
import MarkHandled from '../components/mark-handled';

class RepeatOffenders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      offenders: [],
      offendersHistory: [],
      staffMembers: [],
      filterValue: '',
      lastUpdate: null,
      selectedVenueIds: this.getSelectedVenueIdsFromURL(),
      taxYearStartDate: null,
      taxYearEndDate: null,
      softDodgersCount: null,
      hardDodgersCount: null,
      previousWeekStartDate: null,
    };
  }

  componentDidMount = async () => {
    const response = await getRepeatOffendersRequest();
    const [
      offenders,
      offendersHistory,
      staffMembers,
      reviewsHistory,
      lastUpdate,
      taxYearStartDate,
      taxYearEndDate,
      softDodgersCount,
      hardDodgersCount,
      previousWeekStartDate,
    ] = oFetch(
      response.data,
      'offenders',
      'offendersHistory',
      'staffMembers',
      'reviewsHistory',
      'lastUpdate',
      'taxYearStartDate',
      'taxYearEndDate',
      'softDodgersCount',
      'hardDodgersCount',
      'previousWeekStartDate',
    );

    const mappedOffenders = offenders.map(offender => {
      const staffTypes = oFetch(this.props, 'staffTypes').toJS();
      const venues = oFetch(this.props, 'venues').toJS();
      const offenderId = oFetch(offender, 'staffMemberId');
      const staffMember = staffMembers.find(staffMember => oFetch(staffMember, 'id') === offenderId);
      const staffTypeId = oFetch(staffMember, 'staffTypeId');
      const venueId = oFetch(staffMember, 'venueId');
      const history = offendersHistory.filter(offender => oFetch(offender, 'staffMemberId') === offenderId);
      const reviewHistory = reviewsHistory.filter(review => oFetch(review, 'staffMemberId') === offenderId);
      const staffType = staffTypes.find(staffType => oFetch(staffType, 'id') === staffTypeId);
      const venue = venues.find(venue => oFetch(venue, 'id') === venueId);
      return {
        ...offender,
        ...staffMember,
        history,
        fullName: `${oFetch(staffMember, 'firstName')} ${oFetch(staffMember, 'surname')}`,
        staffType,
        reviewHistory,
        venue: oFetch(venue, 'name'),
      };
    });

    this.setState({
      fetching: false,
      offenders: mappedOffenders,
      filteredOffenders: mappedOffenders,
      offendersHistory,
      staffMembers,
      lastUpdate,
      taxYearStartDate,
      taxYearEndDate,
      softDodgersCount,
      hardDodgersCount,
      previousWeekStartDate,
    });
  };

  changeURL = selectedVenueIds => {
    const venuesQueryString = queryString.stringify({ venues: selectedVenueIds }, { arrayFormat: 'bracket' });
    this.props.history.replace({
      pathname: `/repeat_offenders`,
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
    this.setState({ filterValue: value });
  };

  handleHistoryDetailsClick = weekStart => {
    this.props.history.replace({
      pathname: `/time_dodges/${weekStart}`,
    });
  };

  handleMarkHandledClick = (closeModal, values) => {
    const offenders = oFetch(this.state, 'offenders');
    return markRepeatOffenderRequest({ ...values, weekStart: this.state.startDate }).then(response => {
      const markedOffender = oFetch(response, 'data.offenderLevel');
      const staffMemberId = oFetch(markedOffender, 'staffMemberId');
      const index = offenders.findIndex(offender => oFetch(offender, 'staffMemberId') === staffMemberId);
      offenders[index] = {
        ...offenders[index],
        markNeeded: oFetch(markedOffender, 'markNeeded'),
        reviewLevel: oFetch(markedOffender, 'reviewLevel'),
      };
      this.setState({ offenders });
      closeModal();
    });
  };

  openMarkHandledModal = id => {
    openContentModal({
      submit: this.handleMarkHandledClick,
      config: { title: 'MARK HANDLED', type: MODAL_TYPE2 },
      props: { id },
    })(MarkHandled);
  };

  handleOpenReviewHistoryModal = (fullName, reviewHistory) => {
    openContentModal({
      config: {
        title: (
          <span>
            <span className="boss-modal-window__marked">{fullName}</span> Reviews
          </span>
        ),
        type: MODAL_TYPE1,
        modalClassName: 'boss-modal-window_role_offences',
      },
      props: { reviewHistory },
    })(OffenderReviewHistoryModalContent);
  };

  handleOpenHistoryModal = (fullName, history, staffMemberId) => {
    openContentModal({
      config: {
        title: (
          <span>
            <span className="boss-modal-window__marked">{fullName}</span> Offences
          </span>
        ),
        type: MODAL_TYPE1,
        modalClassName: 'boss-modal-window_role_offences',
      },
      props: { history, staffMemberId, onHistoryDetailsClick: this.handleHistoryDetailsClick },
    })(OffenderHistoryModalContent);
  };

  handleVenueFilterChange = venuesIds => {
    this.setState({
      selectedVenueIds: venuesIds,
    });
    this.changeURL(venuesIds);
  };

  render() {
    const fetching = oFetch(this.state, 'fetching');
    const [title, venues] = oFetch(this.props, 'title', 'venues');

    if (fetching) {
      return null;
    }

    const [
      offenders,
      filterValue,
      selectedVenueIds,
      lastUpdate,
      taxYearStartDate,
      taxYearEndDate,
      softDodgersCount,
      hardDodgersCount,
      previousWeekStartDate,
    ] = oFetch(
      this.state,
      'offenders',
      'filterValue',
      'selectedVenueIds',
      'lastUpdate',
      'taxYearStartDate',
      'taxYearEndDate',
      'softDodgersCount',
      'hardDodgersCount',
      'previousWeekStartDate',
    );
    const filteredOffenders = utils.staffMemberFilterFullNameJS(
      filterValue,
      this.filterByVenues(offenders, selectedVenueIds),
    );
    const markedOffenders = filteredOffenders.filter(offender => oFetch(offender, 'markNeeded') === false);
    const markNeededOffenders = filteredOffenders.filter(offender => oFetch(offender, 'markNeeded') === true);
    const hasMarkedOffenders = markedOffenders.length !== 0;
    const hasMarkNeededOffenders = markNeededOffenders.length !== 0;
    const venueTypes = selectors.getVenueTypes(venues);
    const offendersCount = offenders.length;

    return (
      <div>
        <StaffDashboard
          filterRenderer={() => (
            <VenueSelectFilter
              venueTypes={venueTypes}
              leftSide={() => `Tax year: ${taxYearStartDate} \u2014 ${taxYearEndDate}`}
              selectedVenueIds={selectedVenueIds}
              onChangeVenuesFilter={this.handleVenueFilterChange}
            />
          )}
          title={() => (
            <h1 className="boss-page-dashboard__title">
              <span className="boss-page-dashboard__title-text">{title}</span>
              <span className="boss-page-dashboard__title-text_faded"> (Last updated: {lastUpdate})</span>
              <span className="boss-page-dashboard__title-info">{offendersCount > 0 ? `+${offendersCount}` : 0}</span>
            </h1>
          )}
        />
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <div className="boss-page-main__controls">
              <Link to={`/time_dodges/${previousWeekStartDate}?tab=soft`} className="boss-page-main__control">
                Soft Dodgers - 45-47h or more ({softDodgersCount})
              </Link>
              <Link to={`/time_dodges/${previousWeekStartDate}?tab=hard`} className="boss-page-main__control">
                Hard Dodgers - under 45 ({hardDodgersCount})
              </Link>
              <button
                type="button"
                style={{ position: 'relative' }}
                className="boss-page-main__control boss-page-main__control_state_active"
              >
                <span className="boss-red-badge">20</span> Repeat Offenders ({offendersCount})
              </button>
            </div>
            <TextFilter value={filterValue} onChange={this.handleFilter} />
            {!hasMarkedOffenders && !hasMarkNeededOffenders && <h1>No result found</h1>}
            {hasMarkNeededOffenders && (
              <StaffMembersListWrapper title="Requiring Action">
                <StaffMembersList
                  items={markNeededOffenders}
                  itemRenderer={markNeededOffender => {
                    return (
                      <StaffMemberItem
                        staffMember={markNeededOffender}
                        content={offender => {
                          return (
                            <OffenderInfo
                              onHistoryDetailsClick={this.handleOpenHistoryModal}
                              onMarkHandledClick={this.openMarkHandledModal}
                              onReviewHistoryClick={this.handleOpenReviewHistoryModal}
                              offender={offender}
                            />
                          );
                        }}
                      />
                    );
                  }}
                />
              </StaffMembersListWrapper>
            )}
            {hasMarkedOffenders && (
              <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting boss-page-main__group_context_stack">
                <div className="boss-users">
                  <div className="boss-users__flow boss-users__flow_type_no-space">
                    <StaffMembersList
                      items={markedOffenders}
                      itemRenderer={offender => {
                        return (
                          <StaffMemberItem
                            staffMember={offender}
                            content={offender => {
                              return (
                                <OffenderInfo
                                  onHistoryDetailsClick={this.handleOpenHistoryModal}
                                  onReviewHistoryClick={this.handleOpenReviewHistoryModal}
                                  offender={offender}
                                />
                              );
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RepeatOffenders);
