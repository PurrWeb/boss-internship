import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import safeMoment from "~/lib/safe-moment"
import humanize from 'string-humanize';
import oFetch from "o-fetch";
import _ from 'lodash';

import PasswordInformationListItem from '../components/password-information-list-item';
import DetailsListItem from '../components/details-list-item';
import DetailsList from '../components/details-list';
import {starterEmploymentStatusLabels} from '../../../../constants/other';
import ProfileWrapper from '../../profile-wrapper';

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

const findById = (collection, id) => {
  if (Object.prototype.toString.call(id) === '[object Array]') {
    return _(collection).keyBy('id').at(id).filter().value();
  } else {
    return collection.find(item => item.id === id);
  }
}

@connect(mapStateToProps)
class ProfilePage extends React.PureComponent {
  getCategoryItemsFromProviders(itemProviders, staffMemberData){
    return itemProviders.map(itemProvider => {
      return this.getValueFromProvider(itemProvider, staffMemberData);
    }).filter(itemProvider => itemProvider)
  }

  getValueFromProvider(itemProvider, staffMemberData){
    if (typeof itemProvider === 'function') {
      return itemProvider(staffMemberData);
    }

    const [realName, name] = itemProvider.split(":");
    const key = realName;

    return {
      name: humanize(name || realName),
      value: oFetch(staffMemberData, key),
    }
  }

  employmentDetailItemProviders(staffMemberData){
    let venues = this.props.venues.toJS();
    let staffTypes = this.props.staffTypes.toJS();
    let accessiblePayRates = this.props.accessiblePayRates;

    let result = [
      (item, name = "other_venues") => ({name: humanize(name), value: findById(venues, oFetch(item, name)).map(item => oFetch(item, 'name')).join(', ')}),
      (item, name = "staff_type") => ({name: "Job Type", value: oFetch(findById(staffTypes, oFetch(item, name)), 'name')}),
      (item, name = "starts_at") => ({name: "Start Date", value: safeMoment.uiDateParse(oFetch(item, name)).format('DD MMMM YYYY')}),
      (item, name = "pay_rate") => ({name: humanize(name), value: oFetch(findById(accessiblePayRates, oFetch(item, name)), 'name')}),
      "hours_preference",
      "day_preference",
      "national_insurance_number",
      (item, name="status_statement") => {
        let statusEnumValue = oFetch(item, name);
        if (statusEnumValue) {
          let statusText = oFetch(starterEmploymentStatusLabels, statusEnumValue);
          return {
            name: "Status Statement",
            value: statusText
          };
        }
      }
    ];
    if (oFetch(staffMemberData, 'is_security_staff')) {
      result.push(
        (item, name="sia_badge_expiry_date") => ({
          name: humanize(name),
          value: safeMoment.uiDateParse(oFetch(item, name)).format('DD MMM YYYY')
        })
      )

      result.push(
        (item, name="sia_badge_number") => ({
          name: humanize(name),
          value: oFetch(item, name)
        })
      )
    } else {
      result.unshift(
        (item, name = "master_venue") => ({
          name: "Main Venue",
          value: oFetch(findById(venues, oFetch(item, name)), 'name')
        }),
      )
    }

    return result;
  }

  accountCategoryContent(staffMemberData){
    let result = [];
    let itemIndex = 0;

    let createdAtListItemData = this.getValueFromProvider(
      (item, name = "created_at") => ({name: "Created", value: safeMoment.iso8601Parse(oFetch(item, name)).format('HH:mm DD MMMM YYYY')}),
      staffMemberData
    );
    result.push(<DetailsListItem key={itemIndex} item={createdAtListItemData} />);
    itemIndex = itemIndex + 1;

    let updatedAtListItemData = this.getValueFromProvider(
      (item, name = "updated_at") => ({name: "Modified", value: safeMoment.iso8601Parse(oFetch(item, name)).format('HH:mm DD MMMM YYYY')}),
      staffMemberData
    )
    result.push(<DetailsListItem key={itemIndex} item={updatedAtListItemData} />);
    itemIndex = itemIndex + 1;

    result.push(<PasswordInformationListItem key={itemIndex} staffMember={staffMemberData} />)

    return result
  }

  personalDetailItemProviders(){
    return [
      (item, name = "name") => ({name: humanize(name), value: `${oFetch(item, 'first_name')} ${oFetch(item, 'surname')}` }),
      (item, name = "gender") => ({name: humanize(name), value: humanize(oFetch(item, name))}),
      (item, name = "date_of_birth") => ({
        name: humanize(name),
        value: this.dateOfBirthMoment(oFetch(item, name)) && this.dateOfBirthMoment(oFetch(item, name)).format("DD-MM-YYYY")
      }),
      (item, name = "date_of_birth") => ({
        name: "Age",
        value: this.ageDescription(this.dateOfBirthMoment(oFetch(item, name)))
      })
    ];
  }

  contactDetailItemProviders(){
    return [
      "address",
      'county',
      "country",
      'postcode',
      (item, name = "email") => ({name: "Email Address", value: oFetch(item, name)}),
      "phone_number"
    ];
  }

  renderDetailsList() {
    let staffMemberData = this.props.staffMember.toJS();

    let employmentDetailItems = this.getCategoryItemsFromProviders(this.employmentDetailItemProviders(staffMemberData), staffMemberData);
    let personalDetailItems = this.getCategoryItemsFromProviders(this.personalDetailItemProviders(), staffMemberData);
    let contactDetailItems = this.getCategoryItemsFromProviders(this.contactDetailItemProviders(), staffMemberData);

    let index = 0;
    let listItems = [];

    listItems.push(
      <DetailsList key={index} categoryName="Employment Details" sectionNumber={index + 1}>
      {
        employmentDetailItems.map(
          (item, key) => {
            return <DetailsListItem key={key} item={item} />
          }
        )
      }
      </DetailsList>
    );
    index = index + 1;

    listItems.push(
      <DetailsList key={index} categoryName="Account Details" sectionNumber={index + 1}>
        { this.accountCategoryContent(staffMemberData) }
      </DetailsList>
    );
    index = index + 1;

    listItems.push(
      <DetailsList key={index} categoryName="Personal Details" sectionNumber={index + 1}>
      {
        personalDetailItems.map(
          (item, key) => {
            return <DetailsListItem key={key} item={item} />
          }
        )
      }
      </DetailsList>
    );
    index = index + 1;

    listItems.push(
      <DetailsList key={index} categoryName="Contact Details" sectionNumber={index + 1}>
      {
        contactDetailItems.map(
          (item, key) => {
            return <DetailsListItem key={key} item={item} />
          }
        )
      }
      </DetailsList>
    );
    index = index + 1;

    return listItems;
  }

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
    const {
      staffMember,
    } = this.props;

    return (
      <ProfileWrapper
        currentPage="profile"
      >{this.renderDetailsList()}</ProfileWrapper>
    )
  }
}

export default ProfilePage;
