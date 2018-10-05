import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import VenueSelect from '~/components/security-rota/venue-select';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import queryString from 'query-string';
import * as selectors from '../selectors';
import TabFilter from '../components/tab-filter';
import StaffMemberList from '../components/staff-member-list';
import { getStaffMembersWithTimeDodges } from '../requests';
import Page from '../components/page';
import DashboardFilter from '../components/dashboard-filter';
import oFetch from 'o-fetch';

const TIME_DODGERS_START_LIMIT = 45;
const TIME_DODGERS_END_LIMIT = 47;

const getEndDate = uiDate =>
  safeMoment
    .uiDateParse(uiDate)
    .endOf('isoWeek')
    .format(utils.commonDateFormat);

class TimeDodges extends PureComponent {
  constructor(props) {
    super(props);
    const { weekStartDate } = props.match.params;
    this.timeDodgesDate = moment()
      .subtract(1, 'week')
      .format(utils.commonDateFormat);

    this.state = {
      imStaffMembers: Immutable.List([]),
      imStaffMembersSoftDodgers: Immutable.List([]),
      imStaffMembersHardDodgers: Immutable.List([]),
      isLoaded: false,
      selectedVenueIds: this.getSelectedVenueIdsFromURL(),
      startDate: safeMoment
        .uiDateParse(weekStartDate || this.timeDodgesDate)
        .startOf('isoWeek')
        .format(utils.commonDateFormat),
      endDate: weekStartDate
        ? getEndDate(weekStartDate)
        : safeMoment
            .uiDateParse(this.timeDodgesDate)
            .endOf('isoWeek')
            .format(utils.commonDateFormat),
    };
  }

  getSelectedVenueIdsFromURL = () => {
    const selectedVenueIdsArray = queryString.parse(this.props.location.search, { arrayFormat: 'bracket' }).venues;
    return selectedVenueIdsArray ? selectedVenueIdsArray.map(id => Number(id)) : [];
  };

  fetchStaffMembers = date => {
    return getStaffMembersWithTimeDodges(date).then(res => {
      const staffMembers = oFetch(res, 'data.staffMembers');
      const acceptedHours = oFetch(res, 'data.acceptedHours');
      const paidHolidays = oFetch(res, 'data.paidHolidays');
      const acceptedBreaks = oFetch(res, 'data.acceptedBreaks');

      const imStaffMembers = Immutable.fromJS(
        staffMembers.map(staffMember => ({
          ...staffMember,
          fullName: `${staffMember.firstName} ${staffMember.surname}`,
          hours: acceptedHours[staffMember.id] || 0,
          paidHolidays: paidHolidays[staffMember.id] || 0,
          acceptedBreaks: acceptedBreaks[staffMember.id] || 0,
        })),
      );

      const imStaffMembersSoftDodgers = imStaffMembers.filter(staffMember => {
        const hours = staffMember.get('hours') + staffMember.get('paidHolidays');
        return hours >= TIME_DODGERS_START_LIMIT * 60 && hours <= TIME_DODGERS_END_LIMIT * 60;
      });
      const imStaffMembersHardDodgers = imStaffMembers.filter(staffMember => {
        const hours = staffMember.get('hours') + staffMember.get('paidHolidays');
        return hours < TIME_DODGERS_START_LIMIT * 60;
      });
      return {
        imStaffMembersHardDodgers,
        imStaffMembersSoftDodgers,
        imStaffMembers,
      };
    });
  };

  componentDidMount() {
    const { weekStartDate } = this.props.match.params;
    const { selectedVenueIds } = this.state;

    const date = safeMoment
      .uiDateParse(weekStartDate || this.timeDodgesDate)
      .startOf('isoWeek')
      .format(utils.commonDateFormat);
    if (!weekStartDate) {
      this.changeURL(selectedVenueIds, date);
    }

    this.fetchStaffMembers(date).then(({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers }) => {
      this.setState({
        imStaffMembersHardDodgers,
        imStaffMembersSoftDodgers,
        imStaffMembers,
        isLoaded: true,
      });
    });
  }

  changeURL = (selectedVenueIds, startDate) => {
    const venuesQueryString = queryString.stringify({ venues: selectedVenueIds }, { arrayFormat: 'bracket' });
    this.props.history.replace({
      pathname: `/time_dodges/${startDate}`,
      search: `?${venuesQueryString}`,
    });
  };

  handleChangeVenuesFilter = selectedVenueIds => {
    const { startDate } = this.state;

    this.setState({ selectedVenueIds });
    this.changeURL(selectedVenueIds, startDate);
  };

  handleChangeDateFilter = ({ startDate, endDate }) => {
    const { selectedVenueIds } = this.state;

    const urlStartDate = utils.formatRotaUrlDate(startDate);
    const urlEndDate = utils.formatRotaUrlDate(endDate);
    this.changeURL(selectedVenueIds, urlStartDate);
    this.setState({
      startDate: urlStartDate,
      endDate: urlEndDate,
    });
    this.fetchStaffMembers(urlStartDate).then(
      ({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
        });
      },
    );
  };

  renderDashboardFilter = () => {
    const { startDate, endDate, selectedVenueIds } = this.state;
    const venueTypes = selectors.getVenueTypes(this.props.venues);
    return (
      <DashboardFilter onDateChange={this.handleChangeDateFilter} startDate={startDate} endDate={endDate}>
        <div className="boss-page-dashboard__controls-group">
          <form action="#" className="boss-form">
            <div className="boss-form__field boss-form__field_role_control">
              <p className="boss-form__label boss-form__label_type_icon-venue boss-form__label_type_icon-single" />
              <VenueSelect
                className="boss-form__select_role_dashboard-multi"
                selectedTypes={selectedVenueIds}
                venueTypes={venueTypes}
                onChange={this.handleChangeVenuesFilter}
              />
            </div>
          </form>
        </div>
      </DashboardFilter>
    );
  };

  render() {
    if (!this.state.isLoaded) {
      return null;
    }
    const { imStaffMembers, imStaffMembersHardDodgers, imStaffMembersSoftDodgers } = this.state;
    const { venues } = this.props;
    return (
      <Page
        title={this.props.title}
        venues={this.props.venues}
        selectedVenueIds={this.state.selectedVenueIds}
        count={imStaffMembers.size}
        staffMembers={imStaffMembers}
        staffTypes={this.props.staffTypes}
        tabsFilterRenderer={() => (
          <TabFilter
            timeDodgers={{
              imStaffMembersHardDodgers,
              imStaffMembersSoftDodgers,
              imStaffMembers,
            }}
          />
        )}
        staffMemberListRenderer={staffMembers => (
          <StaffMemberList
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            profileLink={false}
            staffMembers={staffMembers}
            venues={venues}
          />
        )}
        dashboardFilterRenderer={this.renderDashboardFilter}
      />
    );
  }
}

TimeDodges.propTypes = {
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default withRouter(TimeDodges);
