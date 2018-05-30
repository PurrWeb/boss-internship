import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import AssignDashboard from './assign-dashboard';
import ContentWrapper from './assign-content-wrapper';
import StaffList from './assign-staff-list';
import StaffMember from './assign-staff-member';
import { openConfirmationModal } from '~/components/modals';
import AssignConfirm from './assign-confirm';
import Graph from './graph';
import ModalWrapper from './modal-wrapper';
import GraphDetails from './graph-details';

class AssignPage extends PureComponent {
  state = {
    error: null,
    staffMembers: oFetch(this.props, 'staffMembers').toJS(),
  };

  setError = error => {
    this.setState({ error });
  };

  handleFilterStaffMembers = searchQuery => {
    const staffMembers = oFetch(this.props, 'staffMembers');
    this.setState({
      staffMembers: utils.staffMemberFilterCamelCase(searchQuery, staffMembers).toJS(),
    });
  };

  handleOpenConfirmationModal = ({ avatarUrl, fullName, staffMemberId, rotaShifts }) => {
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    openConfirmationModal({
      submit: this.handleAssignRequest,
      config: { title: 'CONFIRM SHIFT ASSIGNMENT' },
      props: { avatarUrl, fullName, staffMemberId, shiftRequest, rotaShifts },
    })(AssignConfirm);
  };

  handleAssignRequest = (hideModal, values) => {

    const staffMemberId = oFetch(values, 'staffMemberId');
    const startsAt = oFetch(values, 'startsAt');
    const endsAt = oFetch(values, 'endsAt');

    const assignShiftRequest = oFetch(this.props, 'assignShiftRequest');
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const id = oFetch(shiftRequest, 'id');

    return assignShiftRequest({ id, staffMemberId, startsAt, endsAt })
      .then(() => {
        hideModal();
        this.handleCloseAssignPage();
      })
      .catch(err => {
        this.setError('There was an error assigning this shift. Please check for errors and try again');
        // hideModal();
        return Promise.reject(err);
      });
  };

  handleCloseAssignPage = () => {
    const setAssigningShiftRequest = oFetch(this.props, 'setAssigningShiftRequest');
    setAssigningShiftRequest(null);
  };

  handleShiftClick = shift => {
    const showGraphDetails = oFetch(this.props, 'showGraphDetails');
    showGraphDetails({ graphDetails: shift });
  };

  closeGraphDetails = () => {
    const closeGraphDetails = oFetch(this.props, 'closeGraphDetails');
    closeGraphDetails();
  };

  render() {
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const rotaShifts = oFetch(this.props, 'rotaShifts');
    const isGraphDetailsOpen = oFetch(this.props, 'isGraphDetailsOpen');
    const graphDetails = oFetch(this.props, 'graphDetails');
    const staffMembers = oFetch(this.state, 'staffMembers');
    const staffMembersFromProps = oFetch(this.props, 'staffMembers');

    const venueTypes = oFetch(this.props, 'venueTypes');
    const staffTypes = oFetch(this.props, 'staffTypes');

    return (
      <div className="boss-page-main">
        <AssignDashboard shiftRequest={shiftRequest} title="Assign Shift Request">
          <a
            onClick={this.handleCloseAssignPage}
            className="boss-button boss-button_role_cancel boss-page-dashboard__button"
          >
            Cancel
          </a>
        </AssignDashboard>
        <ContentWrapper error={this.state.error}>
          <StaffList
            onFilterStaffMembers={this.handleFilterStaffMembers}
            staffMembers={staffMembers}
            itemRenderer={staffMember => {
              return (
                <StaffMember
                  staffMember={staffMember}
                  isDisabled={staffMember.isOverlapped}
                  shiftRequest={shiftRequest}
                  handleOpenConfirmationModal={this.handleOpenConfirmationModal}
                />
              );
            }}
          />
          <ModalWrapper show={isGraphDetailsOpen} onClose={this.closeGraphDetails}>
            {graphDetails && (
              <GraphDetails
                graphDetails={graphDetails.toJS()}
                staffTypes={staffTypes.toJS()}
                venueTypes={venueTypes.toJS()}
              />
            )}
          </ModalWrapper>
          <Graph
            rotaShifts={rotaShifts.toJS()}
            staffMembers={staffMembersFromProps.toJS()}
            venueTypes={venueTypes.toJS()}
            onShiftClick={this.handleShiftClick}
          />
        </ContentWrapper>
      </div>
    );
  }
}

AssignPage.propTypes = {
  shiftRequest: PropTypes.object.isRequired,
  staffMembers: ImmutablePropTypes.list.isRequired,
  rotaShifts: ImmutablePropTypes.list.isRequired,
  staffTypes: ImmutablePropTypes.list.isRequired,
  assignShiftRequest: PropTypes.func.isRequired,
  venueTypes: ImmutablePropTypes.list.isRequired,
  closeGraphDetails: PropTypes.func.isRequired,
  showGraphDetails: PropTypes.func.isRequired,
  isGraphDetailsOpen: PropTypes.bool.isRequired,
  graphDetails: ImmutablePropTypes.map,
};

export default AssignPage;
