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
      imRepeatOffenders: Immutable.List([]),
      isLoaded: false,
      currentTab: 'hard',
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
      const softDodgers = oFetch(res, 'data.softDodgers');
      const hardDodgers = oFetch(res, 'data.hardDodgers');
      const offendersCount = oFetch(res, 'data.offendersCount');

      const imStaffMembersSoftDodgers = Immutable.fromJS(
        softDodgers.map(softDodger => {
          const staffMemberId = oFetch(softDodger, 'staffMemberId');
          const staffMember = staffMembers.find(staffMember => oFetch(staffMember, 'id') === staffMemberId);
          if (!staffMember) {
            throw new Error('Staff member must be present');
          }
          return {
            ...staffMember,
            fullName: `${staffMember.firstName} ${staffMember.surname}`,
            ...softDodger,
            hours: oFetch(softDodger, 'minutes'),
          };
        }),
      );

      const imStaffMembersHardDodgers = Immutable.fromJS(
        hardDodgers.map(hardDodger => {
          const staffMemberId = oFetch(hardDodger, 'staffMemberId');
          const staffMember = staffMembers.find(staffMember => oFetch(staffMember, 'id') === staffMemberId);
          if (!staffMember) {
            throw new Error('Staff member must be present');
          }
          return {
            ...staffMember,
            fullName: `${oFetch(staffMember, 'firstName')} ${oFetch(staffMember, 'surname')}`,
            ...hardDodger,
            hours: oFetch(hardDodger, 'minutes'),
          };
        }),
      );
      return {
        imStaffMembersHardDodgers,
        imStaffMembersSoftDodgers,
        imStaffMembers: imStaffMembersSoftDodgers.concat(imStaffMembersHardDodgers),
        repeatOffendersCount: offendersCount,
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

    this.fetchStaffMembers(date).then(
      ({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers, repeatOffendersCount }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
          repeatOffendersCount,
          isLoaded: true,
        });
      },
    );
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

  handleChangeDateFilter = ({ startDate, endDate }, tab) => {
    const { selectedVenueIds } = this.state;
    const urlStartDate = utils.formatRotaUrlDate(startDate);
    const urlEndDate = utils.formatRotaUrlDate(endDate);
    this.changeURL(selectedVenueIds, urlStartDate, tab);
    this.setState({
      startDate: urlStartDate,
      endDate: urlEndDate,
    });
    this.clearTabFilter();
    this.fetchStaffMembers(urlStartDate).then(
      ({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers, repeatOffendersCount }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
          repeatOffendersCount,
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

  takeClearFunc = clearFunc => {
    this.clearTabFilter = clearFunc;
  };

  handleChangeTab = name => {
    this.setState({ currentTab: name });
  };

  handleOffendersClick = () => {
    this.props.history.replace({
      pathname: `/repeat_offenders`,
    });
  };

  render() {
    if (!this.state.isLoaded) {
      return null;
    }
    const { imStaffMembers, imStaffMembersHardDodgers, imStaffMembersSoftDodgers, repeatOffendersCount } = this.state;
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
            getClearFunc={clearFunc => this.takeClearFunc(clearFunc)}
            timeDodgers={{
              imStaffMembersHardDodgers,
              imStaffMembersSoftDodgers,
              imStaffMembers,
            }}
            onTabClick={this.handleChangeTab}
            onOffendersClick={this.handleOffendersClick}
            selectedTab={this.state.currentTab}
            repeatOffendersCount={repeatOffendersCount}
          />
        )}
        staffMemberListRenderer={staffMembers => {
          return (
            <StaffMemberList
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              profileLink={false}
              staffMembers={staffMembers}
              venues={venues}
            />
          );
        }}
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
