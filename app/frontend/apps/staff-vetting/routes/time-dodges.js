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
import RepeatOffendersList from '../components/repeat-offenders-list';
import OffenderInfo from '../components/offender-info';
import { getStaffMembersWithTimeDodges, markRepeatOffenderRequest } from '../requests';
import Page from '../components/page';
import DashboardFilter from '../components/dashboard-filter';
import oFetch from 'o-fetch';
import { openContentModal, MODAL_TYPE2 } from '~/components/modals';
import MarkHandled from '../components/mark-handled';

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
      const offenders = oFetch(res, 'data.offenders');

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

      const imRepeatOffenders = Immutable.fromJS(
        offenders.map(offender => {
          const staffMemberId = oFetch(offender, 'staffMemberId');
          const staffMember = staffMembers.find(staffMember => oFetch(staffMember, 'id') === staffMemberId);
          if (!staffMember) {
            throw new Error('Staff member must be present');
          }
          const staffTypeId = oFetch(staffMember, 'staffTypeId');
          const venueId = oFetch(staffMember, 'venueId');
          const staffType = this.props.staffTypes.find(staffType => staffType.get('id') === staffTypeId);
          const venue = this.props.venues.find(venue => venue.get('id') === venueId);

          return {
            ...staffMember,
            fullName: `${oFetch(staffMember, 'firstName')} ${oFetch(staffMember, 'surname')}`,
            ...offender,
            staffType: staffType.get('name'),
            venue: venue.get('name'),
          };
        }),
      );

      return {
        imStaffMembersHardDodgers,
        imStaffMembersSoftDodgers,
        imStaffMembers: imStaffMembersSoftDodgers.concat(imStaffMembersHardDodgers),
        imRepeatOffenders,
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
      ({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers, imRepeatOffenders }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
          imRepeatOffenders,
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

  handleChangeDateFilter = ({ startDate, endDate }) => {
    const { selectedVenueIds } = this.state;

    const urlStartDate = utils.formatRotaUrlDate(startDate);
    const urlEndDate = utils.formatRotaUrlDate(endDate);
    this.changeURL(selectedVenueIds, urlStartDate);
    this.setState({
      startDate: urlStartDate,
      endDate: urlEndDate,
    });
    this.clearTabFilter();
    this.fetchStaffMembers(urlStartDate).then(
      ({ imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imStaffMembers, imRepeatOffenders }) => {
        this.setState({
          imStaffMembersHardDodgers,
          imStaffMembersSoftDodgers,
          imStaffMembers,
          imRepeatOffenders,
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

  handleMarkHandledClick = (closeModal, values) => {
    return markRepeatOffenderRequest({ ...values, weekStart: this.state.startDate }).then(response => {
      const markedOffender = oFetch(response, 'data.offenderLevel');
      const staffMemberId = oFetch(markedOffender, 'staffMemberId');
      const index = this.state.imRepeatOffenders.findIndex(
        repeatOffender => repeatOffender.get('staffMemberId') === staffMemberId,
      );
      const imUpdatedOffenders = this.state.imRepeatOffenders.update(index, offender => {
        return offender
          .set('markNeeded', oFetch(markedOffender, 'markNeeded'))
          .set('reviewLevel', oFetch(markedOffender, 'reviewLevel'));
      });
      this.setState({ imRepeatOffenders: imUpdatedOffenders });
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

  takeClearFunc = clearFunc => {
    this.clearTabFilter = clearFunc;
  };

  render() {
    if (!this.state.isLoaded) {
      return null;
    }
    const { imStaffMembers, imStaffMembersHardDodgers, imStaffMembersSoftDodgers, imRepeatOffenders } = this.state;
    const { venues } = this.props;
    return (
      <Page
        title={this.props.title}
        venues={this.props.venues}
        selectedVenueIds={this.state.selectedVenueIds}
        count={imStaffMembers.size}
        staffMembers={imStaffMembers}
        staffTypes={this.props.staffTypes}
        repeatOffenders={imRepeatOffenders}
        tabsFilterRenderer={() => (
          <TabFilter
            getClearFunc={clearFunc => this.takeClearFunc(clearFunc)}
            timeDodgers={{
              imStaffMembersHardDodgers,
              imStaffMembersSoftDodgers,
              imStaffMembers,
            }}
            repeatOffenders={{ imRepeatOffenders }}
          />
        )}
        staffMemberListRenderer={(staffMembers, isRepeatOffendders) => {
          if (isRepeatOffendders) {
            return (
              <RepeatOffendersList
                items={staffMembers}
                itemRenderer={repeatOffender => {
                  return <OffenderInfo offender={repeatOffender} onMarkHandledClick={this.openMarkHandledModal} />;
                }}
              />
            );
          }
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
