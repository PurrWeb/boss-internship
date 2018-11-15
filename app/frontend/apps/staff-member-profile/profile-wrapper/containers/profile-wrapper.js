import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import oFetch from 'o-fetch';
import { openContentModal, openWarningModal } from '~/components/modals';

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
  markRetakeAvatar,
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
        markRetakeAvatar,
      },
      dispatch,
    ),
  };
};

const isActive = (currentPage, page) => {
  return currentPage === page ? 'boss-button_state_active' : '';
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

  renderCardActions = (currentPage, isSecurityStaff, canViewDisciplinary) => {
    return (
      <div className="boss-page-dashboard__switches">
        <a
          href={`profile`}
          className={`${isActive(
            currentPage,
            'profile',
          )} boss-button boss-button_type_small boss-button_role_profile boss-page-dashboard__switch`}
        >
          Profile
        </a>
        <a
          href={`holidays`}
          className={`${isActive(
            currentPage,
            'holidays',
          )} boss-button boss-button_type_small boss-button_role_holidays boss-page-dashboard__switch`}
        >
          Holidays
        </a>
        <a
          href={`owed_hours`}
          className={`${isActive(
            currentPage,
            'owed_hours',
          )} boss-button boss-button_type_small boss-button_role_timelog boss-page-dashboard__switch`}
        >
          Owed hours
        </a>
        <a
          href={`shifts`}
          className={`${isActive(
            currentPage,
            'shifts',
          )} boss-button boss-button_type_small boss-button_role_timelog boss-page-dashboard__switch`}
        >
          Shifts
        </a>
        {!isSecurityStaff && (
          <a
            href={`accessories`}
            className={`${isActive(
              currentPage,
              'accessories',
            )} boss-button boss-button_type_small boss-button_role_accessories boss-page-dashboard__switch`}
          >
            Accessories
          </a>
        )}
        <a
          href={`payments`}
          className={`${isActive(
            currentPage,
            'payments',
          )} boss-button boss-button_type_small boss-button_role_payments boss-page-dashboard__switch`}
        >
          Payments
        </a>
        {canViewDisciplinary && <a
          href={`disciplinaries`}
          className={`${isActive(
            currentPage,
            'disciplinary',
          )} boss-button boss-button_type_small boss-button_role_disciplinary boss-page-dashboard__switch`}
        >
          Disciplinary
        </a>}
      </div>
    );
  };

  handleMarkRetakeAvatar = (handleClose, { staffMemberId }) => {
    const markRetakeAvatar = oFetch(this.props, 'actions.markRetakeAvatar');
    return markRetakeAvatar(staffMemberId).finally(resp => {
      handleClose();
    });
  };

  handleMarkRetakeAvatarModal = () => {
    const staffMember = oFetch(this.props, 'staffMember');
    const staffMemberId = oFetch(staffMember.toJS(), 'id');

    openWarningModal({
      submit: this.handleMarkRetakeAvatar,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Force Retake',
      },
      props: { staffMemberId },
    });
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
    const jsStaffMember = staffMember.toJS();
    const jobType = staffTypes.find(type => type.get('id') === staffMember.get('staff_type'));
    const isSecurityStaff = oFetch(jsStaffMember, 'is_security_staff');
    const canViewDisciplinary = oFetch(permissionsData.toJS(), 'disciplinariesTab.canViewPage');
    const markedRetakeAvatar = oFetch(jsStaffMember, 'markedRetakeAvatar');

    return (
      <div>
        <ContentModal show={disableStaffMemberModal} onClose={hideDisableStaffMemberModal} title="Disable staff member">
          <DisableStaffMemberForm onSubmit={this.getHandleDisableStaffMemberSubmit(staffMember)} />
        </ContentModal>
        <ContentModal show={editAvatarModal} onClose={hideEditAvatarModal} title="Edit Avatar">
          <EditAvatarForm markedRetakeAvatar={markedRetakeAvatar} initialValues={editAvatarFormInitial} />
        </ContentModal>
        <DashboardWrapper>
          {editProfile && (
            <DashboardProfile title="Edit Profile" onCancel={cancelEditProfile} buttonText="Cancel editing" />
          )}
          {!editProfile && (
            <Dashboard>
              <div className="boss-page-dashboard__group">
                <StaffMemberCard
                  currentPage={currentPage}
                  staffMember={jsStaffMember}
                  jobType={jobType.toJS()}
                  onEditAvatar={showEditAvatarModal}
                  onMarkRetakeAvatar={this.handleMarkRetakeAvatarModal}
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
              </div>
              {this.renderCardActions(currentPage, isSecurityStaff, canViewDisciplinary)}
            </Dashboard>
          )}
        </DashboardWrapper>

        <ContentWrapper>
          {editProfile && <EditProfilePage onSubmissionComplete={onStaffMemberChanged} {...profileProps} />}
          {!editProfile && currentPage === 'disciplinaries' && this.props.children}
          {!editProfile && currentPage !== 'disciplinaries' && (
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
