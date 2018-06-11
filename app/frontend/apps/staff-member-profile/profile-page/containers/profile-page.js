import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import safeMoment from "~/lib/safe-moment"
import humanize from 'string-humanize';
import oFetch from "o-fetch";
import _ from 'lodash';
import { bindActionCreators } from 'redux';

import PasswordInformationListItem from '../components/password-information-list-item';
import DetailsListItem from '../components/details-list-item';
import AppDownloadLinkListItem from '../components/app-download-link-list-item'
import DetailsList from '../components/details-list';
import {starterEmploymentStatusLabels} from '../../../../constants/other';
import ProfileWrapper from '../../profile-wrapper';
import {
  sendMobileAppDownloadEmail,
  sendPasswordSetupEmail,
  resendPasswordSetupEmail,
  revokePasswordSetupEmail
} from '../actions';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    staffTypes: state.getIn(['profile', 'staffTypes']),
    payRates: state.getIn(['profile', 'payRates']),
    accessiblePayRates: state.getIn(['profile', 'accessiblePayRates']),
    venues: state.getIn(['profile', 'venues']),
    accessibleVenues: state.getIn(['profile', 'accessibleVenues'])
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      sendMobileAppDownloadEmail,
      sendPasswordSetupEmail,
      resendPasswordSetupEmail,
      revokePasswordSetupEmail
    }, dispatch)
  };
}
const findById = (collection, id) => {
  if (Object.prototype.toString.call(id) === '[object Array]') {
    return _(collection).keyBy('id').at(id).filter().value();
  } else {
    return collection.find(item => item.id === id);
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends React.PureComponent {

  handleDisableStaffMemberSubmit = (values) => {
    confirm('This staff member has an associated user account. Disabling here will not disable the user and the will still be able to log in.', {
      actionButtonText: 'Confirm',
      title: 'WARNING !!!',
    }).then(() => {
      this.props.actions.disableStaffMemberRequest(values.toJS());
    })
  }

  dateOfBirthMoment(rawValue){
    return rawValue ? safeMoment.uiDateParse(rawValue) : null;
  }

  ageDescription(dobMoment){
    return dobMoment ? moment().diff(dobMoment, 'years') : 'N/A';
  }

  render() {
    const staffMember = oFetch(this.props, 'staffMember').toJS();
    const venues = oFetch(this.props, 'venues').toJS();
    const staffTypes = oFetch(this.props, 'staffTypes').toJS();
    const accessiblePayRates = oFetch(this.props, 'accessiblePayRates');
    const isSecurityStaff = oFetch(staffMember, 'is_security_staff');
    const actions = oFetch(this.props, 'actions');

    const {
      sendPasswordSetupEmail,
      resendPasswordSetupEmail,
      revokePasswordSetupEmail
    } = this.props.actions;

    let linkIndex = 0;
    const appDownloadLinks = oFetch(this.props, 'appDownloadLinks').map((appDownloadLink)=>{
      const objectWithIndex = Object.assign({index: linkIndex}, appDownloadLink)
      linkIndex = linkIndex + 1;
      return objectWithIndex;
    });

    let masterVenueId = staffMember["master_venue"];
    let masterVenueValue = masterVenueId ? oFetch(findById(venues, masterVenueId), 'name') : 'N/A';

    return (
      <ProfileWrapper
        currentPage="profile"
      >
        <DetailsList key={1} categoryName="Employment Details" sectionNumber={1}>
          <DetailsListItem item={{name: "Master venue", value: masterVenueValue}} />
          <DetailsListItem item={{name: "Other venues", value: findById(venues, oFetch(staffMember, 'other_venues')).map(item => oFetch(item, 'name')).join(', ')}} />
          <DetailsListItem item={{name: "Job Type", value: oFetch(findById(staffTypes, oFetch(staffMember, 'staff_type')), 'name')}} />
          <DetailsListItem item={{name: "Starts At", value: safeMoment.uiDateParse(oFetch(staffMember, 'starts_at')).format('DD MMMM YYYY')}} />
          <DetailsListItem item={{name: "Pay Rate", value: oFetch(findById(accessiblePayRates, oFetch(staffMember, 'pay_rate')), 'name')}} />
          <DetailsListItem item={{name: "Hours Preference", value: oFetch(staffMember, 'hours_preference')}} />
          <DetailsListItem item={{name: "National Insurance Number", value: oFetch(staffMember, 'national_insurance_number')}} />
          <DetailsListItem item={{name: 'Sage ID', value: oFetch(staffMember, 'sageId') || 'Not Set'}} />
          <DetailsListItem item={{name: "Status Statement", value: oFetch(staffMember, 'status_statement') ? oFetch(starterEmploymentStatusLabels, oFetch(staffMember, 'status_statement')) : ''}} />
          {isSecurityStaff && <DetailsListItem item={{name: "Sia badge expiry date", value: safeMoment.uiDateParse(oFetch(staffMember, 'sia_badge_expiry_date')).format('DD MMM YYYY')}} />}
          {isSecurityStaff && <DetailsListItem item={{name: "Sia badge number", value: oFetch(staffMember, 'sia_badge_number')}} />}
        </DetailsList>
        <DetailsList key={2} categoryName="Account Details" sectionNumber={2}>
          <DetailsListItem item={{name: "Created", value: safeMoment.iso8601Parse(oFetch(staffMember, 'created_at')).format('HH:mm DD MMMM YYYY')}} />
          <DetailsListItem item={{name: "Modified", value: safeMoment.iso8601Parse(oFetch(staffMember, 'updated_at')).format('HH:mm DD MMMM YYYY')}} />
          <PasswordInformationListItem
            key="passwordInformation"
            staffMember={staffMember}
            onSendPasswordSetupEmail={sendPasswordSetupEmail}
            onResendPasswordSetupEmail={resendPasswordSetupEmail}
            onRevokePasswordSetupEmail={revokePasswordSetupEmail}
          />
        </DetailsList>
        <DetailsList key={3} categoryName="Personal Details" sectionNumber={3}>
          <DetailsListItem item={{name: "Name", value: `${oFetch(staffMember, 'first_name')} ${oFetch(staffMember, 'surname')}`}} />
          <DetailsListItem item={{name: "Gender", value: humanize(oFetch(staffMember, 'gender')) }} />
          <DetailsListItem item={{name: "Date or birth", value: this.dateOfBirthMoment(oFetch(staffMember, 'date_of_birth')) && this.dateOfBirthMoment(oFetch(staffMember, 'date_of_birth')).format("DD-MM-YYYY") }} />
          <DetailsListItem item={{name: "Age", value: this.ageDescription(this.dateOfBirthMoment(oFetch(staffMember, 'date_of_birth'))) }} />
        </DetailsList>
        <DetailsList key={4} categoryName="Personal Details" sectionNumber={4}>
          <DetailsListItem item={{name: "Address", value: oFetch(staffMember, 'address') }} />
          <DetailsListItem item={{name: "County", value: oFetch(staffMember, 'county') }} />
          <DetailsListItem item={{name: "Country", value: oFetch(staffMember, 'country') }} />
          <DetailsListItem item={{name: "Postcode", value: oFetch(staffMember, 'postcode') }} />
          <DetailsListItem item={{name: "Email Address", value: oFetch(staffMember, 'email') }} />
          <DetailsListItem item={{name: "Phone number", value: oFetch(staffMember, 'phone_number') }} />
        </DetailsList>
        { (appDownloadLinks.length > 0) &&
          <DetailsList key={5} categoryName="Mobile Apps" sectionNumber={5}>
            { appDownloadLinks.map((appDownloadLink) => {
                return <AppDownloadLinkListItem
                  key={oFetch(appDownloadLink, 'index') }
                  index={oFetch(appDownloadLink, 'index')}
                  appName={oFetch(appDownloadLink, 'appName')}
                  lastSentAt={appDownloadLink['lastSentAt']}
                  onLinkClick={() => {
                    oFetch(actions, 'sendMobileAppDownloadEmail')(
                      oFetch(appDownloadLink, 'downloadUrl'),
                      oFetch(appDownloadLink, 'appName'),
                      oFetch(appDownloadLink, 'mobileAppId')
                    )}
                  } />;
              }) }
          </DetailsList> }
      </ProfileWrapper>
    )
  }
}

export default ProfilePage;
