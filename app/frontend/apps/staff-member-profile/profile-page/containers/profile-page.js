import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import safeMoment from "~/lib/safe-moment"
import humanize from 'string-humanize';
import oFetch from "o-fetch";
import _ from 'lodash';

import DetailsList from '../components/details-list';
import {starterEmploymentStatusLabels} from '../../../../constants/other';
import ProfileWrapper from '../../profile-wrapper';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profile', 'staffMember']),
    venues: state.getIn(['profile', 'venues']),
    staffTypes: state.getIn(['profile', 'staffTypes']),
    payRates: state.getIn(['profile', 'payRates']),
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

  initializeData() {
    let staffMemberData = this.props.staffMember.toJS();
    let venues = this.props.venues.toJS();
    let staffTypes = this.props.staffTypes.toJS();
    let payRates = this.props.payRates.toJS();

    let employmentDetailItems = [
      (item, name = "other_venues") => ({name: humanize(name), value: findById(venues, oFetch(item, name)).map(item => oFetch(item, 'name')).join(', ')}),
      (item, name = "staff_type") => ({name: "Job Type", value: oFetch(findById(staffTypes, oFetch(item, name)), 'name')}),
      (item, name = "starts_at") => ({name: "Start Date", value: safeMoment.uiDateParse(oFetch(item, name)).format('DD MMMM YYYY')}),
      (item, name = "pay_rate") => ({name: humanize(name), value: oFetch(findById(payRates, oFetch(item, name)), 'name')}),
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
      employmentDetailItems.push(
        (item, name="sia_badge_expiry_date") => ({
          name: humanize(name),
          value: safeMoment.uiDateParse(oFetch(item, name)).format('DD MMM YYYY')
        })
      )

      employmentDetailItems.push(
        (item, name="sia_badge_number") => ({
          name: humanize(name),
          value: oFetch(item, name)
        })
      )
    } else {
      employmentDetailItems.unshift(
        (item, name = "master_venue") => ({
          name: "Main Venue",
          value: oFetch(findById(venues, oFetch(item, name)), 'name')
        }),
      )
    }

    this.detailsListOptions = [
      {
        categoryName: "Employment Details",
        items: employmentDetailItems
      },
      {
        categoryName: "Account Details",
        items: [
          (item, name = "created_at") => ({name: "Created", value: safeMoment.iso8601Parse(oFetch(item, name)).format('HH:mm DD MMMM YYYY')}),
          (item, name = "updated_at") => ({name: "Modified", value: safeMoment.iso8601Parse(oFetch(item, name)).format('HH:mm DD MMMM YYYY')})
        ]
      },
      {
        categoryName: "Personal Details",
        items: [
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
    
    this.initializeData();
    const categories = this.filledDetailsOptions(this.detailsListOptions, staffMember.toJS());

    return (
      <ProfileWrapper
        currentPage="profile"
      >{this.renderDetailsList(categories)}</ProfileWrapper>
    )
  }
}

export default ProfilePage;
