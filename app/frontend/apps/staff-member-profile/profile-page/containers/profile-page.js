import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import moment from 'moment';
import humanize from 'string-humanize';
import oFetch from "o-fetch";

import DetailsList from '../components/details-list';
import {starterEmploymentStatusLabels} from '../../../../constants/other';
import ProfileWrapper from '../../profile-wrapper';

import {
  updateStaffMember,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    staffMember: state.getIn(['profileDetails', 'staffMember']),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateStaffMember,
    }, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);
    let staffMemberData = this.props.staffMember.toJS();

    let employmentDetailItems = [
      (item, name = "master_venue") => ({name: "Main Venue", value: oFetch(item, name).label}),
      (item, name = "other_venues") => ({name: humanize(name), value: oFetch(item, name).map(venue => venue.label).join(', ')}),
      (item, name = "staff_type") => ({name: "Job Type", value: oFetch(item, name).label}),
      (item, name = "starts_at") => ({name: "Start Date", value: moment(oFetch(item, name), 'DD-MM-YYYY').format('DD MMMM YYYY')}),
      (item, name = "pay_rate") => ({name: humanize(name), value: oFetch(item, name).label}),
      "hours_preference",
      "day_preference",
      "national_insurance_number",
      (item, name="status_statement") => {
        let statusEnumValue = oFetch(item, name);
        let statusText = oFetch(starterEmploymentStatusLabels, statusEnumValue);
        return {
          name: "Status Statement",
          value: statusText
        };
      }
    ];

    if (oFetch(staffMemberData, 'is_security_staff')) {
      employmentDetailItems.push(
        (item, name="sia_badge_expiry_date") => ({
          name: humanize(name),
          value: moment(oFetch(item, name), 'DD-MM-YYYY').format('DD MMM YYYY')
        })
      )

      employmentDetailItems.push(
        (item, name="sia_badge_number") => ({
          name: humanize(name),
          value: oFetch(item, name)
        })
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
      actions: {
        updateStaffMember,
      }
    } = this.props;

    const categories = this.filledDetailsOptions(this.detailsListOptions, staffMember.toJS());

    return (
      <ProfileWrapper
        currentPage="profile"
        onStaffMemberChanged={(staffMember) => updateStaffMember(staffMember)}
      >{this.renderDetailsList(categories)}</ProfileWrapper>
    )
  }
}

export default ProfilePage;
