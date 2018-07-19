import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import VenueSelect from '~/components/security-rota/venue-select';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import queryString from 'query-string';
import * as selectors from '../selectors';
import TabFilter from '../components/tab-filter';
import StaffMemberList from '../components/staff-member-list';
import { getStaffMembersWithTimeDodges } from '../requests';
import Page from '../components/page';
import DashboardFilter from '../components/dashboard-filter';

const getEndDate = uiDate =>
  safeMoment
    .uiDateParse(uiDate)
    .add(6, 'd')
    .format(utils.commonDateFormat);

class StaffMembersWithTimeDodgers extends PureComponent {
  constructor(props) {
    super(props);
    const { weekStartDate } = props.match.params;
    const { timeDodgesDate } = props;

    this.state = {
      imStaffMembers: Immutable.List([]),
      imStaffMembersSoftDodgers: Immutable.List([]),
      imStaffMembersHardDodgers: Immutable.List([]),
      isLoaded: false,
      selectedVenueIds: this.getSelectedVenueIdsFromURL(),
      startDate: weekStartDate ? weekStartDate : timeDodgesDate,
      endDate: weekStartDate ? getEndDate(weekStartDate) : getEndDate(timeDodgesDate),
    };
  }

  getSelectedVenueIdsFromURL = () => {
    const selectedVenueIdsArray = queryString.parse(this.props.location.search, { arrayFormat: 'bracket' }).venues;
    return selectedVenueIdsArray ? selectedVenueIdsArray.map(id => Number(id)) : [];
  };

  fetchStaffMembers = date => {
    return getStaffMembersWithTimeDodges(date).then(res => {
      const imStaffMembersHardDodgers = Immutable.fromJS(
        res.data.staffMembersHardDodgers.map(staffMember => ({
          ...staffMember,
          fullName: `${staffMember.firstName} ${staffMember.surname}`,
        })),
      );
      const imStaffMembersSoftDodgers = Immutable.fromJS(
        res.data.staffMembersSoftDodgers.map(staffMember => ({
          ...staffMember,
          fullName: `${staffMember.firstName} ${staffMember.surname}`,
        })),
      );
      const imStaffMembers = imStaffMembersHardDodgers.concat(imStaffMembersSoftDodgers);
      return {
        imStaffMembersHardDodgers,
        imStaffMembersSoftDodgers,
        imStaffMembers,
      };
    });
  };

  componentDidMount() {
    const { weekStartDate } = this.props.match.params;
    const { timeDodgesDate } = this.props;
    const { selectedVenueIds } = this.state;

    const date = weekStartDate ? weekStartDate : timeDodgesDate;
    if (!weekStartDate) {
      this.changeURL(selectedVenueIds, date);
    }

    if (this.props.count > 0) {
      this.fetchStaffMembers(date).then(({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
          isLoaded: true,
        });
      });
    } else {
      this.setState({
        isLoaded: true,
      });
    }
  }

  changeURL = (selectedVenueIds, startDate) => {
    const venuesQueryString = queryString.stringify({ venues: selectedVenueIds }, { arrayFormat: 'bracket' });
    this.props.history.replace({
      pathname: `/staff_members_with_time_dodges/${startDate}`,
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
        staffMemberListRenderer={staffMembers => <StaffMemberList staffMembers={staffMembers} venues={venues} />}
        dashboardFilterRenderer={this.renderDashboardFilter}
      />
    );
  }
}

StaffMembersWithTimeDodgers.propTypes = {
  count: PropTypes.number.isRequired,
  venues: ImmutablePropTypes.list,
  staffTypes: ImmutablePropTypes.list,
  title: PropTypes.string.isRequired,
};

export default withRouter(StaffMembersWithTimeDodgers);
