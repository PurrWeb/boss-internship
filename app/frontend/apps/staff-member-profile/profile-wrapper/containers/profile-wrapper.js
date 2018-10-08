import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';
import { openContentModal } from '~/components/modals';

import DashboardWrapper from '~/components/dashboard-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import Dashboard from '../components/dashboard';
import StaffMemberCard from '../components/staff-member-card';
import StaffMemberProfileActions from '../components/staff-member-profile-actions';
import EditProfilePage from '../components/edit-profile-page';
import EnableProfile from '../components/enable-profile';
import DashboardProfile from '../components/dashboard-profile';

import ContentModal from '~/components/content-modal';
import DisableStaffMemberForm from '../components/disable-staff-member-form';
import EditAvatarForm from '../components/edit-avatar-form';

import confirm from '~/lib/confirm-utils';

import {
  editProfile as startEditProfile,
  enableStaffMember,
  cancelEditProfile,
  showDisableStaffMemberModal,
  hideDisableStaffMemberModal,
  disableStaffMemberRequest,
  showEditAvatarModal,
  hideEditAvatarModal,
} from '../actions';

const mapStateToProps = state => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    editProfile: state.getIn(['profile', 'editProfile']),
    staffTypes: state.getIn(['profile', 'staffTypes']),
    genderValues: state.getIn(['profile', 'genderValues']),
    disableStaffMemberModal: state.getIn(['profile', 'disableStaffMemberModal']),
    editAvatarModal: state.getIn(['profile', 'editAvatarModal']),
    venues: state.getIn(['profile', 'venues']),
    accessibleVenues: state.getIn(['profile', 'accessibleVenues']),
    payRates: state.getIn(['profile', 'payRates']),
    accessiblePayRates: state.getIn(['profile', 'accessiblePayRates']),
    permissionsData: state.getIn(['profile', 'permissionsData']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        startEditProfile,
        cancelEditProfile,
        showDisableStaffMemberModal,
        hideDisableStaffMemberModal,
        disableStaffMemberRequest,
        showEditAvatarModal,
        hideEditAvatarModal,
        enableStaffMember,
      },
      dispatch,
    ),
  };
};

@connect(mapStateToProps, mapDispatchToProps)
class ProfileWrapper extends React.PureComponent {
  getHandleDisableStaffMemberSubmit(staffMember) {
    return values => {
      let staffMemberData = staffMember.toJS();

      if (oFetch(staffMemberData, 'has_user')) {
        confirm(
          'This staff member has an associated user account. Disabling here will not disable the user and the will still be able to log in.',
          {
            actionButtonText: 'Confirm',
            title: 'WARNING !!!',
          },
        ).then(() => {
          this.props.actions.disableStaffMemberRequest(values.toJS());
        });
      } else {
        this.props.actions.disableStaffMemberRequest(values.toJS());
      }
    };
  }

  handleEnableProfileSubmit = (hideModal, values) => {
    return this.props.actions.enableStaffMember(values).then(() => {
      hideModal();
    });
  };

  handleEnableProfile = () => {
    openContentModal({
      submit: this.handleEnableProfileSubmit,
      config: { title: 'Enable Staff Member' },
    })(EnableProfile);
  };

  render() {
    const {
      staffMember,
      editProfile,
      accessibleVenues,
      staffTypes,
      accessiblePayRates,
      genderValues,
      disableStaffMemberModal,
      editAvatarModal,
      onStaffMemberChanged,
      currentPage,
      permissionsData,
      venues,
      actions: {
        startEditProfile,
        cancelEditProfile,
        showDisableStaffMemberModal,
        hideDisableStaffMemberModal,
        showEditAvatarModal,
        hideEditAvatarModal,
      },
    } = this.props;

    const profileProps = {
      accessibleVenues,
      staffTypes,
      accessiblePayRates,
      genderValues,
      staffMember,
      permissionsData,
    };

    const editAvatarFormInitial = {
      avatar: staffMember.get('avatar'),
    };

    const jobType = staffTypes.find(type => type.get('id') === staffMember.get('staff_type'));

    return (
      <div>
        <ContentModal show={disableStaffMemberModal} onClose={hideDisableStaffMemberModal} title="Disable staff member">
          <DisableStaffMemberForm onSubmit={this.getHandleDisableStaffMemberSubmit(staffMember)} />
        </ContentModal>
        <ContentModal show={editAvatarModal} onClose={hideEditAvatarModal} title="Edit Avatar">
          <EditAvatarForm initialValues={editAvatarFormInitial} />
        </ContentModal>
        <DashboardWrapper>
          {editProfile && (
            <DashboardProfile title="Edit Profile" onCancel={cancelEditProfile} buttonText="Cancel editing" />
          )}
          {!editProfile && (
            <Dashboard>
              <StaffMemberCard
                currentPage={currentPage}
                staffMember={staffMember.toJS()}
                jobType={jobType.toJS()}
                onEditAvatar={showEditAvatarModal}
                venues={venues.toJS()}
                permissionsData={permissionsData}
              />
              <StaffMemberProfileActions
                staffMember={staffMember}
                permissionsData={permissionsData}
                onEditProfile={startEditProfile}
                onDisableStaffMember={showDisableStaffMemberModal}
                onEnableProfile={this.handleEnableProfile}
              />
            </Dashboard>
          )}
        </DashboardWrapper>

        <ContentWrapper>
          {editProfile && <EditProfilePage onSubmissionComplete={onStaffMemberChanged} {...profileProps} />}
          {!editProfile && <div className="boss-page-main__flow">{this.props.children}</div>}
          { !editProfile && currentPage === 'disciplinaries' && this.props.children}
          { !editProfile && currentPage !== 'disciplinaries' && (
            <div className="boss-page-main__flow">
              {this.props.children}
            </div>
          )}
        </ContentWrapper>
      </div>
    );
  }
}

export default ProfileWrapper;
