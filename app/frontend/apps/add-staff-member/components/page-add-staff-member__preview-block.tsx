/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';
import {pipe, omit, toPairs, map, addIndex} from 'ramda';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';
import registrationStepBack from '../../../action-creators/registration-step-back';
import requestingStaffMemberSave from '../../../action-creators/requesting-staff-member-save';
import {
  BasicInformationForm, UploadPhotoForm, VenueForm, ContactDetailsForm, WorkForm,
  FormStructure
} from '../../../reducers/forms';
import {StringDict, Dict, BoolDict} from '../../../interfaces/index';
import {FieldState} from 'react-redux-form';
import {validateAllAddStaffMemberStepForms} from '../../../helpers/form-validators';
import {isRequiredField, isWrongEmail, isPhoneNumber, formatInvalid} from '../../../constants/form-errors';

type FieldDataPair = [string, FieldState];
type ErrorPair = [string, boolean];

interface Props {
}

interface MappedProps {
  readonly basicInformationFields: BasicInformationForm;
  readonly uploadPhotoFormFields: UploadPhotoForm;
  readonly venueFormFields: VenueForm;
  readonly contactDetailsFormFields: ContactDetailsForm;
  readonly workFormFields: WorkForm;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

const ErrorTextsMap: StringDict = {
  isFilled: isRequiredField,
  isEmail: isWrongEmail,
  isPhoneNumber: isPhoneNumber,
  isNationalInsuranceNumber: formatInvalid,
  isPinCode: formatInvalid
};

class Component extends React.Component<PropsFromConnect, State> {
  componentDidMount() {
    validateAllAddStaffMemberStepForms();
  }

  onFormComplete = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    this.props.dispatch(requestingStaffMemberSave);
  };

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.dispatch(registrationStepBack);
  };

  static renderListItemErrors(errors: BoolDict) {
    return pipe< BoolDict, ErrorPair[], JSX.Element[], JSX.Element | null >(
      toPairs,
      addIndex(map)((errorsPair: ErrorPair, idx: number) => {
        const errorText = ErrorTextsMap[errorsPair[0]];
        return (
          <li key={idx} className="boss3-info-fields-block__field-error">
            {errorText}
          </li>
        );
      }),
      (errorElements) => {
        return errorElements.length ? (
            <ul className="boss3-info-fields-block__field-errors">
              {errorElements}
            </ul>
          ) : null;
      }
    )(errors);
  }

  static renderInformationList(blockData: FormStructure<StringDict>, labelsMap: StringDict) {
    return pipe< FormStructure<StringDict>, Dict<FieldState>, FieldDataPair[], JSX.Element[] >(
      omit(['$form']),
      toPairs,
      addIndex(map)((pair: FieldDataPair, idx: number) => {
        const labelVal = labelsMap[pair[0]];

        return (
          <li key={idx} className="boss3-info-fields-block__list-item">
            <span className="boss3-info-fields-block__field-name">{labelVal}</span>
            <span className="boss3-info-fields-block__field-value">{pair[1].value}</span>
            { Component.renderListItemErrors(pair[1].errors) }
          </li>
        );
      })
    )(blockData);
  }

  static renderInformationBlock(formFields: FormStructure<{}>, labelsMap: StringDict, header: string, index?: number) {
    const isWithIndex: boolean = index !== undefined;
    const withIndexClass = isWithIndex ? 'boss3-info-block_type_with-index' : '';

    const indexElement = isWithIndex ?
      <div className="boss3-info-block__index">{index}</div> :
      null;

    return (
      <div className={`boss3-info-block ${withIndexClass} boss3-forms-block_adjust_info-block`}>
        {indexElement}
        <h3 className="boss3-info-block__header">{header}</h3>

        <ul className="boss3-info-fields-block">
          {Component.renderInformationList(formFields, labelsMap)}
        </ul>
      </div>
    );
  }

  renderBasicInformationSummaryBlock() {
    return Component.renderInformationBlock(
      this.props.basicInformationFields,
      {
        firstName: 'First Name',
        surname: 'Surname',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth'
      },
      'Basic Information',
      1
    );
  }

  renderAvatarSummaryBlock() {
    return Component.renderInformationBlock(
      this.props.uploadPhotoFormFields,
      {},
      'Avatar',
      2
    );
  }

  renderVenueSummaryBlock() {
    return Component.renderInformationBlock(
      this.props.venueFormFields,
      {
        mainVenue: 'Main Venue',
        otherVenues: 'Other Venues',
        startsAt: 'Starts At'
      },
      'Venue',
      3
    );
  }

  renderAddressSummaryBlock() {
    return Component.renderInformationBlock(
      this.props.contactDetailsFormFields,
      {
        email: 'Email',
        address: 'Address',
        country: 'Country',
        postCode: 'Post Code',
        phoneNumber: 'Phone Number'
      },
      'Address',
      4
    );
  }

  renderWorkSummaryBlock() {
    return Component.renderInformationBlock(
      this.props.workFormFields,
      {
        staffType: 'Staff Type',
        siaBadgeNumber: 'Sia Badge Number',
        siaBadgeExpiryDate: 'Sia Badge Expiry Date',
        pinCode: 'PinCode',
        nationalInsuranceNumber: 'National Insurance Number',
        dayPreference: 'Day Preference',
        hoursPreference: 'Hours Preference',
        payRate: 'Pay Rate',
        starterEmploymentStatus: 'Starter Employment Status'
      },
      'Work',
      5
    );
  }


  render() {
    return (
      <div className="boss3-forms-block">

        {this.renderBasicInformationSummaryBlock()}
        {this.renderAvatarSummaryBlock()}
        {this.renderVenueSummaryBlock()}
        {this.renderAddressSummaryBlock()}
        {this.renderWorkSummaryBlock()}

        <div className="boss3-buttons-group boss3-forms-block_adjust_buttons-group">
          <a href=""
             className="boss3-button boss3-button_role_back boss3-buttons-group_adjust_button"
             onClick={this.onBackClick}
          >
            Back
          </a>
          <a href=""
             onClick={this.onFormComplete}
             className="boss3-button boss3-button_role_submit boss3-buttons-group_adjust_button"
          >
            Continue
          </a>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  const {forms} = state.formsData;

  return {
    basicInformationFields: forms.basicInformationForm,
    uploadPhotoFormFields: forms.uploadPhotoForm,
    venueFormFields: forms.venueForm,
    contactDetailsFormFields: forms.contactDetailsForm,
    workFormFields: forms.workForm
  };
};

export default connect(
  mapStateToProps
)(Component);
