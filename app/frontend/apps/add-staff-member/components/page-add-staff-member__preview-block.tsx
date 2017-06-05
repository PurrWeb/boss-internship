/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import * as moment from 'moment';
import {connect} from 'react-redux';
import {pipe, omit, toPairs, map, addIndex, find, curry, isNil} from 'ramda';
import * as cx from 'classnames';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure, StarterEmploymentStatus, ArrayErrors} from '../../../interfaces/store-models';
import steppingBackRegistration from '../../../action-creators/stepping-back-registration';
import requestingStaffMemberSave from '../../../action-creators/requesting-staff-member-save';
import {
  BasicInformationForm, VenueForm, ContactDetailsForm, WorkForm,
  FormStructure
} from '../../../reducers/forms';
import {StringDict, Dict, BoolDict} from '../../../interfaces/index';
import {StaffMember} from '../../../interfaces/staff-member';
import {FieldState} from 'react-redux-form';
import {isRequiredField, isWrongEmail, isPhoneNumber, formatInvalid} from '../../../constants/form-errors';
import {previewDateFormat} from '../../../constants/index';
import {OptionData} from '../../../interfaces/common-data-types';
import {starterEmploymentStatusLabels} from '../../../constants/other';

import {ADD_STAFF_MEMBER_STEPS} from '../../../constants/other';
import changeStep from '../../../action-creators/current-step-changed';
import {ProgressButton} from './progress-button';

type FieldDataPair = [string, FieldState];
type ValidityPair = [string, boolean];

type ValueTransformer = (val: any) => string;

interface Props {
}

interface MappedProps {
  readonly avatarPreview: string;
  readonly basicInformationFields: BasicInformationForm;
  readonly venueFormFields: VenueForm;
  readonly contactDetailsFormFields: ContactDetailsForm;
  readonly workFormFields: WorkForm;
  readonly venues: OptionData[];
  readonly staffTypes: OptionData[];
  readonly payRates: OptionData[];
  readonly staffMembers: StaffMember[];
  readonly errors: ArrayErrors;
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
  allUsedForms: FormStructure<{}>[];

  constructor(props: PropsFromConnect) {
    super(props);

    this.allUsedForms = [
      this.props.basicInformationFields,
      this.props.venueFormFields,
      this.props.contactDetailsFormFields,
      this.props.workFormFields
    ];
  }

  flaggedUnreviewedStaffMembers = () => {
    return this.props.staffMembers.filter((staffMember) => !staffMember.reviewed );
  }

  onFormComplete = () => {
    this.props.dispatch(requestingStaffMemberSave);
  };

  static getFormattedDate(val: any): string {
    const momentDate = moment(val);

    if (momentDate.isValid()) {
      return momentDate.format(previewDateFormat);
    } else {
      return '';
    }
  }

  static getOptionName(options: OptionData[], id: number): string {
    return pipe< OptionData[], OptionData | undefined, string >(
      find((option: OptionData) => option.id === id),
      (option?: OptionData) => (option || {} as Partial<OptionData>).name || ''
    )(options);
  }

  onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.dispatch(changeStep('', ADD_STAFF_MEMBER_STEPS.PreviewBlock - 1));
  };

  static renderListItemErrors(validity: BoolDict) {
    return pipe< BoolDict, ValidityPair[], JSX.Element[], JSX.Element | null >(
      toPairs,
      addIndex(map)((validityPair: ValidityPair, idx: number) => validityPair[1] ? null :
        (
          <li key={idx} className="boss-info-fields-block__field-error">
            {ErrorTextsMap[validityPair[0]]}
          </li>
        )
      ),
      (errorElements) => errorElements.length ? (
          <ul className="boss-info-fields-block__field-errors">
            {errorElements}
          </ul>
        ) : null
    )(validity);
  }

  static getTextFromFieldValue(fieldValue: string | Date) {
    if (typeof fieldValue === 'string') {
      return fieldValue;
    } else {
      return String(fieldValue);
    }
  }

  static renderInformationList(blockData: FormStructure<StringDict>, labelsMap: StringDict,
                               valueTransformers: Dict<ValueTransformer> = {} as Dict<ValueTransformer>) {
    const listElements = pipe< FormStructure<StringDict>, Dict<FieldState>, FieldDataPair[], JSX.Element[] >(
      omit(['$form']),
      toPairs,
      addIndex(map)((pair: FieldDataPair, idx: number) => {
        const fieldName = pair[0];
        const fieldData = pair[1];
        const fieldTransformer = valueTransformers[fieldName];
        const labelVal = labelsMap[fieldName];
        const textValue = fieldTransformer ? fieldTransformer(fieldData.value) : Component.getTextFromFieldValue(fieldData.value);
        const labelClassName = cx('boss-info-fields-block__field-name', {
          'boss-info-fields-block__field-name_type_unfilled': isNil(fieldData.value) || fieldData.value === ''
        });

        return (
          <li key={idx} className="boss-info-fields-block__list-item">
            <span className={labelClassName}>{labelVal}</span>
            <span className="boss-info-fields-block__field-value">{textValue}</span>
            { Component.renderListItemErrors(fieldData.validity) }
          </li>
        );
      })
    )(blockData);

    return (
      <ul className="boss-info-fields-block">
        {listElements}
      </ul>
    );
  }

  static renderInformationBlock(content: JSX.Element | null, header: string, index?: number) {
    const isWithIndex: boolean = index !== undefined;
    const withIndexClass = isWithIndex ? 'boss-info-block_type_with-index' : '';

    const indexElement = isWithIndex ?
      <div className="boss-info-block__index">{index}</div> :
      null;

    return (
      <div className={`boss-info-block ${withIndexClass} boss-forms-block_adjust_info-block`}>
        {indexElement}
        <h3 className="boss-info-block__header">{header}</h3>

        {content}
      </div>
    );
  }

  static isAllFormsValid(forms: FormStructure<{}>[], haveUnreviewedStaffMembers: boolean) {
    return !find((form: FormStructure<{}>) => {
      return form.$form.valid === false;
    })(forms) && !haveUnreviewedStaffMembers;
  }

  renderBasicInformationSummaryBlock() {
    const content = Component.renderInformationList(this.props.basicInformationFields,
      {
        firstName: 'First Name',
        surname: 'Surname',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth'
      }, {
        dateOfBirth: Component.getFormattedDate
      });

    return Component.renderInformationBlock(
      content,
      'Basic Information',
      1
    );
  }

  renderAvatarSummaryBlock() {
    const {avatarPreview} = this.props;

    const content = avatarPreview ? (
      <img
        src={avatarPreview}
        className="boss-info-block__image"
      />
    ) : (
      <span className="boss-info-block__error">
        {isRequiredField}
      </span>
    );

    return Component.renderInformationBlock(
      content,
      'Avatar',
      2
    );
  }

  renderVenueSummaryBlock() {
    const content = Component.renderInformationList(this.props.venueFormFields,
      {
        mainVenue: 'Main Venue',
        otherVenues: 'Other Venues',
        startsAt: 'Starts At'
      }, {
        mainVenue: curry<OptionData[], number, string>(Component.getOptionName)(this.props.venues),
        otherVenues: curry<OptionData[], number, string>(Component.getOptionName)(this.props.venues),
        startsAt: Component.getFormattedDate
      }
    );

    return Component.renderInformationBlock(
      content,
      'Venue',
      3
    );
  }

  renderAddressSummaryBlock() {
    const content = Component.renderInformationList(this.props.contactDetailsFormFields,
      {
        email: 'Email',
        address: 'Address',
        country: 'Country',
        county: 'County',
        postCode: 'Post Code',
        phoneNumber: 'Phone Number'
      });

    return Component.renderInformationBlock(
      content,
      'Address',
      4
    );
  }

  renderWorkSummaryBlock() {
    const content = Component.renderInformationList(this.props.workFormFields,
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
      }, {
        staffType: curry<OptionData[], number, string>(Component.getOptionName)(this.props.staffTypes),
        payRate: curry<OptionData[], number, string>(Component.getOptionName)(this.props.payRates),
        starterEmploymentStatus: (val: StarterEmploymentStatus) => starterEmploymentStatusLabels[val]
      }
    );

    return Component.renderInformationBlock(
      content,
      'Work',
      5
    );
  }

  renderContinueButton() {
    return Component.isAllFormsValid(this.allUsedForms, !!this.flaggedUnreviewedStaffMembers().length) ? (
      <ProgressButton onClick={this.onFormComplete} pendingText="Saving ...">
        Continue
      </ProgressButton>
    ) : null;
  }

  render() {
    return (
      <div className="boss-forms-block">
        {this.renderBasicInformationSummaryBlock()}
        {this.renderAvatarSummaryBlock()}
        {this.renderVenueSummaryBlock()}
        {this.renderAddressSummaryBlock()}
        {this.renderWorkSummaryBlock()}
        { !!this.props.errors.messages.length && <div className="boss-form__field ">
          <div className="boss-form__error">
            <p className="boss-form__error-text">
              { this.props.errors.messages.map((message, i) => <span key={i} className="boss-form__error-line">{message}</span>)}
            </p>
          </div>
        </div>}

        <div className="boss-buttons-group boss-forms-block_adjust_buttons-group">
          <a href=""
             className="boss-button boss-button_role_back boss-buttons-group_adjust_button"
             onClick={this.onBackClick}
          >
            Back
          </a>
          {this.renderContinueButton()}
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  const {forms} = state.formsData;
  const {avatarPreview, venues, staffTypes, payRates, staffMembers, errors} = state.app;

  return {
    avatarPreview: avatarPreview,
    basicInformationFields: forms.basicInformationForm,
    venueFormFields: forms.venueForm,
    contactDetailsFormFields: forms.contactDetailsForm,
    workFormFields: forms.workForm,
    venues,
    staffTypes,
    payRates,
    staffMembers,
    errors
  };
};

export default connect(
  mapStateToProps
)(Component);
