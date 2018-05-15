import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import ModalWrapper from './modal-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import RotaDailyGraphFilter from './rota-daily-graph-filter';
import RotaGraph from './rota-graph';
import AddShifts from './add-shifts';
import StaffMemberInfo from './staff-member-info';
import GraphDetails from './graph-details';
import { BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE } from '~/lib/utils';

import {
  showGraphDetails,
  closeGraphDetails,
  openMultipleShift,
  closeMultipleShift,
  setVenuesFilter,
} from '../actions';

import {
  rotasSelector,
  venueIdsForCurrentDaySelector,
  venuesSelector,
  staffTypesSelector,
  rotaDateSelector,
  rotaShiftsSelector,
  staffMembersSelector,
  venuesFilterIdsSelector,
  getVenueTypes,
  getRotaShifts,
} from '../selectors';

const mapStateToProps = state => {
  return {
    rotas: rotasSelector(state),
    venueIdsForCurrentDay: venueIdsForCurrentDaySelector(state),
    venues: venuesSelector(state),
    staffTypes: staffTypesSelector(state),
    rotaDate: rotaDateSelector(state),
    rotaShifts: rotaShiftsSelector(state),
    filteredRotaShifts: getRotaShifts(state),
    staffMembers: staffMembersSelector(state),
    isAddingNewShift: state.getIn(['page', 'isAddingNewShift']),
    isGraphDetailsOpen: state.getIn(['page', 'isGraphDetailsOpen']),
    graphDetails: state.getIn(['page', 'graphDetails']),
    isMultipleShift: state.getIn(['page', 'isMultipleShift']),
    venuesFilterIds: venuesFilterIdsSelector(state),
    venueTypes: getVenueTypes(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        showGraphDetails,
        closeGraphDetails,
        openMultipleShift,
        closeMultipleShift,
        setVenuesFilter,
      },
      dispatch,
    ),
  };
};
@connect(mapStateToProps, mapDispatchToProps)
class RotaDailyContent extends React.Component {
  constructor(props) {
    super(props);
  }

  handleGraphVenueChange = venueIds => {
    this.props.actions.setVenuesFilter(venueIds);
  };

  handleShiftClick = shift => {
    this.props.actions.showGraphDetails(shift);
  };

  closeGraphDetails = () => {
    this.props.actions.closeGraphDetails();
  };

  getVenueTypes() {
    return this.props.venueTypes.map(venue => venue.set('id', `${venue.get('type')}_${venue.get('id')}`));
  }

  render() {
    const {
      rotas,
      isAddingNewShift,
      staffTypes,
      rotaDate,
      staffMembers,
      isGraphDetailsOpen,
      graphDetails,
      isMultipleShift,
      venues,
      venueIdsForCurrentDay,
      actions: { openMultipleShift, closeMultipleShift },
      venueTypes,
      filteredRotaShifts,
    } = this.props;
    const rotaGraphClassName = isAddingNewShift
      ? 'boss-rotas__graphs_state_mobile-hidden'
      : '';
    const addShiftsClassName = !isAddingNewShift
      ? 'boss-rotas__manager_state_mobile-hidden'
      : '';
    const rotaStatus = graphDetails && graphDetails.getIn(['originalShiftObject', 'venueType']) === BOSS_VENUE_TYPE
      ? rotas.find(
          r =>
            r.get('id') === graphDetails.getIn(['originalShiftObject', 'rota']),
        ).status
      : '';
    return (
      <ContentWrapper>
        <div className="boss-rotas">
          <div className={`boss-rotas__graphs ${rotaGraphClassName}`}>
            <ModalWrapper
              show={isGraphDetailsOpen}
              onClose={this.closeGraphDetails}
            >
              {isGraphDetailsOpen && (
                <GraphDetails
                  rotaShift={graphDetails.get('originalShiftObject')}
                  staffMember={graphDetails.get('staff')}
                  rotaStatus={rotaStatus}
                  staffTypes={staffTypes}
                  rotaDate={rotaDate}
                  venueTypes={this.getVenueTypes()}
                />
              )}
            </ModalWrapper>
            <RotaDailyGraphFilter
              selectedTypes={this.props.venuesFilterIds.toJS()}
              venueTypes={this.getVenueTypes()}
              rotaDate={rotaDate}
              onVenueChange={this.handleGraphVenueChange}
            />
            <RotaGraph
              rotaShifts={filteredRotaShifts}
              totalRotaShifts={this.props.rotaShifts.size}
              staffTypes={staffTypes.toJS()}
              staffMembers={staffMembers.toJS()}
              onShiftClick={this.handleShiftClick}
              venueTypes={this.getVenueTypes()}
            />
          </div>
          <AddShifts
            venueTypes={this.getVenueTypes()}
            venues={venues}
            staffTypes={staffTypes}
            staffMembers={this.props.staffMembers}
            rotaDate={rotaDate}
            rotas={rotas}
            className={addShiftsClassName}
            isMultipleShift={isMultipleShift}
            onOpenMultipleShift={openMultipleShift}
            onCloseMultipleShift={closeMultipleShift}
          />
        </div>
      </ContentWrapper>
    );
  }
}

RotaDailyContent.PropTypes = {
  rotas: ImmutablePropTypes.list.isRequired,
  venueIdsForCurrentDay: ImmutablePropTypes.set.isRequired,
  venues: ImmutablePropTypes.list.isRequired,
  staffTypes: ImmutablePropTypes.list.isRequired,
  rotaDate: PropTypes.string.isRequired,
  rotaShifts: ImmutablePropTypes.list.isRequired,
  staffMembers: ImmutablePropTypes.list.isRequired,
  venuesFilterIds: ImmutablePropTypes.list.isRequired,
  isAddingNewShift: PropTypes.bool.isRequired,
  isGraphDetailsOpen: PropTypes.bool.isRequired,
  isMultipleShift: PropTypes.bool.isRequired,
  graphDetails: ImmutablePropTypes.map,
  actions: PropTypes.object.isRequired,
  venueTypes: PropTypes.array.isRequired,
  filteredRotaShifts: PropTypes.array.isRequired,
};

export default RotaDailyContent;
