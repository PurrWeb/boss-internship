import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import ModalWrapper from './modal-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import RotaDailyGraphFilter from './rota-daily-graph-filter';
import RotaGraph from './rota-graph';
import AddShifts from './add-shifts';
import StaffMemberInfo from './staff-member-info';
import GraphDetails from './graph-details';

import {
  showGraphDetails,
  closeGraphDetails,
  openMultipleShift,
  closeMultipleShift,
  setStaffTypesFilter,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    staffTypes: state.getIn(['page', 'staffTypes']),
    rotaDate: state.getIn(['page', 'rota', 'date']),
    rotaStatus: state.getIn(['page', 'rota', 'status']),
    rotaShifts: state.getIn(['page', 'rotaShifts']),
    staffMembers: state.getIn(['page', 'staffMembers']),
    isAddingNewShift: state.getIn(['page', 'isAddingNewShift']),
    isGraphDetailsOpen: state.getIn(['page', 'isGraphDetailsOpen']),
    graphDetails: state.getIn(['page', 'graphDetails']),
    isMultipleShift: state.getIn(['page', 'isMultipleShift']),
    staffTypesFilterIds: state.getIn(['page', 'staffTypesFilterIds']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showGraphDetails,
      closeGraphDetails,
      openMultipleShift,
      closeMultipleShift,
      setStaffTypesFilter,
    }, dispatch)
  };
}
@connect(mapStateToProps, mapDispatchToProps)
class RotaDailyContent extends React.Component {
  constructor(props) {
    super(props);
  }
  
  handleGraphStaffTypeChange = (staffTypeIds) => {
    this.props.actions.setStaffTypesFilter(staffTypeIds)
  }

  getRotaShifts = () => {
    const staffTypeFilter = this.props.staffTypesFilterIds;
    if (staffTypeFilter.size === 0) {
      return this.props.rotaShifts.toJS();
    } else {
      return this.props.rotaShifts.filter((rotaShift) => {
        const staffMember = this.props.staffMembers.find(staffMember => staffMember.get('id') === rotaShift.get('staff_member'));
        if (!staffTypeFilter.includes(staffMember.get('staff_type'))) {
          return false;
        }
        return true;
      }).toJS();
    }
  }
  
  handleShiftClick = (shift) => {
    this.props.actions.showGraphDetails(shift);
  }

  closeGraphDetails = () => {
    this.props.actions.closeGraphDetails();
  }

  render() {
    const {
      isAddingNewShift,
      staffTypes,
      rotaDate,
      staffMembers,
      rotaStatus,
      isGraphDetailsOpen,
      graphDetails,
      isMultipleShift,
      actions: {
        openMultipleShift,
        closeMultipleShift,
      }
    } = this.props;
    
    const rotaGraphClassName = isAddingNewShift ? 'boss-rotas__graphs_state_mobile-hidden' : '';
    const addShiftsClassName =  !isAddingNewShift ? 'boss-rotas__manager_state_mobile-hidden' : '';
    return (
      <ContentWrapper>
        <div className="boss-rotas">
          <div className={`boss-rotas__graphs ${rotaGraphClassName}`}>
            <ModalWrapper
              show={isGraphDetailsOpen}
              onClose={this.closeGraphDetails}
            >
              { isGraphDetailsOpen && <GraphDetails
                  rotaShift={graphDetails.get('originalShiftObject')}
                  staffMember={graphDetails.get('staff')}
                  rotaStatus={rotaStatus}
                  staffTypes={staffTypes}
                  rotaDate={rotaDate}
                />
              }
            </ModalWrapper>
            <RotaDailyGraphFilter
              selectedTypes={this.props.staffTypesFilterIds.toJS()}
              staffTypes={staffTypes.toJS()}
              rotaDate={rotaDate}
              onStaffTypesChange={this.handleGraphStaffTypeChange}
            />
            <RotaGraph
              rotaShifts={this.getRotaShifts()}
              staffTypes={staffTypes.toJS()}
              staffMembers={staffMembers.toJS()}
              onShiftClick={this.handleShiftClick}
            />
          </div>
          <AddShifts
            staffTypes={staffTypes}
            staffMembers={this.props.staffMembers}
            rotaDate={rotaDate}
            rotaStatus={rotaStatus}
            className={addShiftsClassName}
            isMultipleShift={isMultipleShift}
            onOpenMultipleShift={openMultipleShift}
            onCloseMultipleShift={closeMultipleShift}
          />
        </div>
      </ContentWrapper>
    )
  }
}

export default RotaDailyContent;
