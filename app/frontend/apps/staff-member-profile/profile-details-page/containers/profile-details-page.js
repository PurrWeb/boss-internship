import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import oFetch from "o-fetch";

import DashboardWrapper from '~/components/dashboard-wrapper';
import ContentWrapper from '~/components/content-wrapper';
import Dashboard from '../../common/dashboard';
import StaffMemberCard from '../../common/staff-member-card';
import StaffMemberProfileActions from '../../common/staff-member-profile-actions';
import DetailsList from '../components/details-list';
import EditProfilePage from '../components/edit-profile-page';
import EnableProfilePage from '../components/enable-profile-page';
import DashboardProfile from '../components/dashboard-profile';

import ContentModal from '~/components/content-modal';
import DisableStaffMemberForm from '../../common/disable-staff-member-form';
import EditAvatarForm from '../../common/edit-avatar-form';

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
  hideEditAvatarModal,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    editProfile: state.getIn(['profile', 'editProfile']),
    enableProfile: state.getIn(['profile', 'enableProfile']),
    venues: state.getIn(['profile', 'venues']),
    staffTypes: state.getIn(['profile', 'staffTypes']),
    payRates: state.getIn(['profile', 'payRates']),
    genderValues: state.getIn(['profile', 'genderValues']),
    disableStaffMemberModal: state.getIn(['profile', 'disableStaffMemberModal']),
    editAvatarModal: state.getIn(['profile', 'editAvatarModal']),
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
      hideEditAvatarModal,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileDetailsPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.detailsListOptions = [
      {
        categoryName: "Employment Details",
        items: [
          (item, name = "master_venue") => ({name: "Main Venue", value: oFetch(item, name).label}),
          (item, name = "other_venues") => ({name: humanize(name), value: oFetch(item, name).map(venue => venue.label).join(', ')}),
          (item, name = "staff_type") => ({name: "Job Type", value: oFetch(item, name).label}),
          (item, name = "starts_at") => ({name: "Start Date", value: moment(oFetch(item, name), 'DD-MM-YYYY').format('DD MMMM YYYY')}),
          (item, name = "pay_rate") => ({name: humanize(name), value: oFetch(item, name).label}),
          "hours_preference",
          "day_preference",
          "national_insurance_number"
        ]
      },
      {
        categoryName: "Account Details",
        items: [
          (item, name = "created_at") => ({name: "Created", value: moment(oFetch(item, name)).format('HH:mm DD MMMM YYYY')}),
          (item, name = "updated_at") => ({name: "Modified", value: moment(oFetch(item, name)).format('HH:mm DD MMMM YYYY')})
        ]
      },
      {
        categoryName: "Personal Details",
        items: [
          (item, name = "name") => ({name: humanize(name), value: `${oFetch(item, 'first_name')} ${oFetch(item, 'surname')}` }),
          (item, name = "gender") => ({name: humanize(name), value: humanize(oFetch(item, name))}),
          (item, name = "date_of_birth") => ({name: humanize(name), value: moment(oFetch(item, name)).format('DD MMMM YYYY')}),
          (item, name = "date_of_birth") => ({name: "Age", value: moment().diff(moment(oFetch(item, name)), 'years')})
        ]
      },
      {
        categoryName: "Contact Details",
        items: [
          "address",
          'county',
          "country",
          'postcode',
          (item, name = "email") => ({name: "Email Address", value: oFetch(item, name)}),
          "phone_number"
        ]
      }
    ];
  }

  filledDetailsOptions(options, data) {
    return options.map(category => {
      return {
        categoryName: category.categoryName,
        items: category.items.map(item => {
          if (typeof item === 'function') {
            return item(data);
          }

          const [realName, name] = item.split(":");
          const key = realName;

          return {
            name: humanize(name || realName),
            value: oFetch(data, key),
          }
        }).filter(item => item)
      }
    })
  }

  renderDetailsList(categories) {
    return categories.map((category, key) => {
      return <DetailsList key={key} category={category} index={key + 1}/>
    });
  }

  handleDisableStaffMemberSubmit = (values) => {
    confirm('This staff member has an associated user account. Disabling here will not disable the user and the will still be able to log in.', {
      actionButtonText: 'Confirm',
      title: 'WARNING !!!',
    }).then(() => {
      this.props.actions.disableStaffMemberRequest(values.toJS());
    })
  }

  render() {
    const {
      staffMember,
      editProfile,
      enableProfile,
      venues,
      staffTypes,
      payRates,
      genderValues,
      disableStaffMemberModal,
      editAvatarModal,
      actions: {
        startEditProfile,
        cancelEditProfile,
        startEnableProfile,
        cancelEnableProfile,
        showDisableStaffMemberModal,
        hideDisableStaffMemberModal,
        disableStaffMemberRequest,
        showEditAvatarModal,
        hideEditAvatarModal,
      }
    } = this.props;
    
    const categories = this.filledDetailsOptions(this.detailsListOptions, staffMember.toJS());
    const staffMemberFullName = `${staffMember.get('first_name')} ${staffMember.get('surname')}`

    const profileProps = {
      venues,
      staffTypes,
      payRates,
      genderValues,
      staffMember,
    };
    
    const editAvatarFormInitial = {
      avatar: staffMember.get('avatar_url'),
    }

    return (
      <div>
        <ContentModal
          show={disableStaffMemberModal}
          onClose={() => hideDisableStaffMemberModal()}
          title="Disable staff member"
        >
          <DisableStaffMemberForm
            onSubmit={this.handleDisableStaffMemberSubmit}
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
                  staffMember={staffMember}
                  onEditAvatar={showEditAvatarModal}
                />
                <StaffMemberProfileActions
                  staffMember={staffMember}
                  onEditProfile={() => startEditProfile()}
                  onDisableStaffMember={() => showDisableStaffMemberModal()}
                  onEnableProfile={() => startEnableProfile()}
                />
              </Dashboard>
          }
        </DashboardWrapper>

        <ContentWrapper>
          
          { editProfile && <EditProfilePage {...profileProps} />}
          { enableProfile && <EnableProfilePage {...profileProps} />}
          { !editProfile && !enableProfile && <div className="boss-page-main__flow">
                { this.renderDetailsList(categories) }
              </div>
          }
        </ContentWrapper>
      </div>
    )
  }
}

export default ProfileDetailsPage;
