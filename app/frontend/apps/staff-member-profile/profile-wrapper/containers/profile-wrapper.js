import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import humanize from 'string-humanize';
import oFetch from "o-fetch";
import {starterEmploymentStatusLabels} from '../../../../constants/other';

import DashboardWrapper from '~/components/dashboard-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import Dashboard from '../components/dashboard';
import StaffMemberCard from '../components/staff-member-card';
import StaffMemberProfileActions from '../components/staff-member-profile-actions';
import EditProfilePage from '../components/edit-profile-page';
import EnableProfilePage from '../components/enable-profile-page';
import DashboardProfile from '../components/dashboard-profile';

import ContentModal from '~/components/content-modal';
import DisableStaffMemberForm from '../components/disable-staff-member-form';
import EditAvatarForm from '../components/edit-avatar-form';

import confirm from '~/lib/confirm-utils';

import {
  editProfile as startEditProfile,
  cancelEditProfile,
  enableProfile as startEnableProfile,
  cancelEnableProfile,
  showDisableStaffMemberModal,
  hideDisableStaffMemberModal,
  disableStaffMemberRequest,
  showEditAvatarModal,
  hideEditAvatarModal
} from '../actions';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    editProfile: state.getIn(['profile', 'editProfile']),
    enableProfile: state.getIn(['profile', 'enableProfile']),
    staffTypes: state.getIn(['profile', 'staffTypes']),
    genderValues: state.getIn(['profile', 'genderValues']),
    disableStaffMemberModal: state.getIn(['profile', 'disableStaffMemberModal']),
    editAvatarModal: state.getIn(['profile', 'editAvatarModal']),
    venues: state.getIn(['profile', 'venues']),
    accessibleVenues: state.getIn(['profile', 'accessibleVenues']),
    payRates: state.getIn(['profile', 'payRates']),
    accessiblePayRates: state.getIn(['profile', 'accessiblePayRates']),
    permissionsData: state.getIn(['profile', 'permissionsData'])
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      startEditProfile,
      cancelEditProfile,
      startEnableProfile,
      cancelEnableProfile,
      showDisableStaffMemberModal,
      hideDisableStaffMemberModal,
      disableStaffMemberRequest,
      showEditAvatarModal,
      hideEditAvatarModal
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getHandleDisableStaffMemberSubmit(staffMember) {
    return (values) => {
      let staffMemberData = staffMember.toJS()

      let warningMessage = null
      if (oFetch(staffMemberData, 'has_user')) {
        confirm('This staff member has an associated user account. Disabling here will not disable the user and the will still be able to log in.', {
          actionButtonText: 'Confirm',
          title: 'WARNING !!!',
        }).then(() => {
          this.props.actions.disableStaffMemberRequest(values.toJS());
        })
      } else {
        this.props.actions.disableStaffMemberRequest(values.toJS());
      }
    }
  }

  render() {
    const {
      staffMember,
      editProfile,
      enableProfile,
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
        startEnableProfile,
        cancelEnableProfile,
        showDisableStaffMemberModal,
        hideDisableStaffMemberModal,
        disableStaffMemberRequest,
        showEditAvatarModal,
        hideEditAvatarModal
      }
    } = this.props;

    const staffMemberFullName = `${staffMember.get('first_name')} ${staffMember.get('surname')}`

    const profileProps = {
      accessibleVenues,
      staffTypes,
      accessiblePayRates,
      genderValues,
      staffMember,
      permissionsData
    };

    const editAvatarFormInitial = {
      avatar: staffMember.get('avatar'),
    }
    const jobType = staffTypes.find(type => type.get('id') === staffMember.get('staff_type'));

    return (
      <div>
        <ContentModal
          show={disableStaffMemberModal}
          onClose={() => hideDisableStaffMemberModal()}
          title="Disable staff member"
        >
          <DisableStaffMemberForm
            onSubmit={this.getHandleDisableStaffMemberSubmit(staffMember)}
          />
        </ContentModal>
        <ContentModal
          show={editAvatarModal}
          onClose={() => hideEditAvatarModal()}
          title="Edit Avatar"
        >
          <EditAvatarForm
            initialValues={editAvatarFormInitial}
          />
        </ContentModal>
        <DashboardWrapper>
          { editProfile && <DashboardProfile
                title="Edit Profile"
                onCancel={cancelEditProfile}
                buttonText="Cancel editing"
              />
          }
          { enableProfile && <DashboardProfile
                title={`Enable ${staffMemberFullName}`}
                onCancel={cancelEnableProfile}
                buttonText="Cancel enabling"
              />
          }
          { !editProfile && !enableProfile &&  <Dashboard>
                <StaffMemberCard
                  currentPage={currentPage}
                  staffMember={staffMember.toJS()}
                  jobType={jobType.toJS()}
                  onEditAvatar={showEditAvatarModal}
                  venues={venues.toJS()}
                />
                <StaffMemberProfileActions
                  staffMember={staffMember}
                  permissionsData={permissionsData}
                  onEditProfile={() => startEditProfile()}
                  onDisableStaffMember={() => showDisableStaffMemberModal()}
                  onEnableProfile={() => startEnableProfile()}
                />
              </Dashboard>
          }
        </DashboardWrapper>

        <ContentWrapper>

          { editProfile && <EditProfilePage onSubmissionComplete={onStaffMemberChanged} {...profileProps} />}
          { enableProfile && <EnableProfilePage {...profileProps} />}
          { !editProfile && !enableProfile && <div className="boss-page-main__flow">
              {this.props.children}
            </div>
          }
        </ContentWrapper>
      </div>
    )
  }
}

export default ProfileWrapper;
